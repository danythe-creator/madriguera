// Prueba de punta a punta: abre la app en un navegador real (tamaño celular) y recorre lo principal.
// Requiere Playwright (en GitHub Actions se instala solo). Ejecutar:  node tests/e2e.mjs
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.json':'application/json',
  '.svg':'image/svg+xml', '.png':'image/png', '.webmanifest':'application/manifest+json' };

// Servidor estático mínimo (sin dependencias).
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  try {
    const file = join(ROOT, path.endsWith('/') ? path + 'index.html' : path);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' });
    res.end(await readFile(file));
  } catch { res.writeHead(404); res.end('no'); }
}).listen(0);
const URL_ = `http://localhost:${server.address().port}/`;

const errors = [];
const steps = [];
const step = async (name, fn) => { await fn(); steps.push(name); console.log('✓', name); };

const browser = await chromium.launch();
try {
  const ctx = await browser.newContext({ viewport: { width: 400, height: 820 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', m => { if (m.type() === 'error' && !/fonts\.(googleapis|gstatic)/.test(m.text() + (m.location()?.url || ''))) errors.push(m.text() + ' ' + (m.location()?.url || '')); });
  page.on('dialog', d => d.accept('nota de prueba'));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort()); // sin internet en pruebas

  await step('abre la app con Manchis en casa', async () => {
    await page.goto(URL_);
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.waitForSelector('#petname');
    if ((await page.textContent('#petname')) !== 'Manchis') throw new Error('la mascota inicial no es Manchis');
  });

  await step('completa una lección y gana XP', async () => {
    await page.click('#btnStudy');
    for (let n = 0; n < 40 && !(await page.$('.done')); n++){
      if (await page.$('#inp')){ await page.fill('#inp', 'hello'); await page.press('#inp', 'Enter'); }
      else await page.keyboard.press(String(1 + (n % 4)));
      await page.waitForSelector('#fb.show');
      if (n === 0) await page.click('#btnReport'); // reportar un error
      await page.keyboard.press('Enter');
    }
    await page.waitForSelector('.done');
    const xp = await page.evaluate(() => JSON.parse(localStorage.getItem('madriguera.v2')).xp);
    if (!(xp > 0)) throw new Error('no se sumó XP');
    const reports = await page.evaluate(() => JSON.parse(localStorage.getItem('madriguera.v2')).reports.length);
    if (reports !== 1) throw new Error('no se guardó el reporte');
    await page.click('#btnHome');
  });

  await step('compra en la tienda y adopta', async () => {
    await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('madriguera.v2')); s.seeds = 200; localStorage.setItem('madriguera.v2', JSON.stringify(s)); });
    await page.reload();
    await page.click('nav button[data-v=shop]');
    await page.click('.buy[data-id=rat_albino]'); await page.click('.buy[data-id=rat_albino]');
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('madriguera.v2')));
    if (!st.unlocked.includes('rat_albino') || st.seeds !== 160) throw new Error('la compra falló');
  });

  await step('las mascotas conviven en "Juntos"', async () => {
    await page.click('nav button[data-v=home]');
    await page.click('#btnYard');
    await page.waitForSelector('.ypet');
    if ((await page.$$('.ypet')).length < 3) throw new Error('faltan mascotas en el patio');
  });

  await step('recibe y abre una carta sorpresa', async () => {
    const link = await page.evaluate(async () => {
      const m = await import('./js/letters.js');
      return location.pathname + '#cartas=' + m.encodeLetters([{ id: 't1', from: 'Prueba', es: 'Hola', en: 'Hi', when: { t: 'now' } }]);
    });
    await page.goto(URL_.replace(/\/$/, '') + link);
    await page.waitForSelector('#letterBtn:not([hidden])');
    await page.click('#letterBtn', { force: true });
    await page.click('.envfront', { force: true });
    await page.waitForSelector('.paper .len');
  });

  await step('hace la prueba de nivel y una lección A2 completa', async () => {
    const dismissNews = async () => { await page.waitForTimeout(1700); if (await page.locator('#newsModal:not([hidden])').count()) await page.click('#newsClose'); };
    await page.goto(URL_); await page.reload(); await dismissNews();
    await page.click('nav button[data-v=units]');
    await page.click('#btnPlacement');
    for (let i = 0; i < 15; i++){ await page.click('#ex .opt[data-i="0"]'); await page.waitForTimeout(320); }
    await page.waitForSelector('#ex .done');
    // forzar nivel A2 para que la ruta quede abierta aunque las respuestas fueran al azar
    await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('madriguera.v2')); s.placement = { level: 'A2', skipA1: true, openA2: false, ts: Date.now() }; localStorage.setItem('madriguera.v2', JSON.stringify(s)); });
    await page.goto(URL_); await page.reload(); await dismissNews();
    await page.click('#btnStudy');
    for (let n = 0; n < 60 && !(await page.locator('#ex .done').count()); n++){
      if (await page.locator('#ex .cta').count()){ await page.click('#ex .cta'); continue; }
      if (await page.locator('#skipSpeak').count()){ await page.click('#skipSpeak'); continue; }
      if (await page.locator('#ex .match').count()){
        for (const e of await page.locator('.tile.m[data-side=en]').all()){ const i = await e.getAttribute('data-i'); await e.click(); await page.click(`.tile.m[data-side=es][data-i="${i}"]`); }
      } else if (await page.locator('#bank').count()){ await page.locator('#bank .tile').first().click(); await page.click('#btnCheck'); }
      else if (await page.locator('#inp').count()){ await page.fill('#inp', 'wake up'); await page.click('#btnCheck'); }
      else await page.click('#ex .opt[data-i="0"]');
      await page.waitForSelector('#fb.show');
      await page.click('#btnNext');
    }
    await page.waitForSelector('#ex .done');
    const st = await page.evaluate(() => JSON.parse(localStorage.getItem('madriguera.v2')));
    if (!st.lessons['a2-routine:l1']?.done) throw new Error('la lección A2 no quedó registrada');
    if (!Object.keys(st.cards).some(k => k.startsWith('w:a2-routine:'))) throw new Error('no se programó el repaso de las palabras A2');
  });

  if (errors.length) throw new Error('Errores en la consola:\n' + errors.join('\n'));
  console.log(`\nTodo bien: ${steps.length} pasos.`);
} catch (e) {
  console.error('✗', e.message);
  process.exitCode = 1;
} finally {
  await browser.close();
  server.close();
}
