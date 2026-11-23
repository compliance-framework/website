// Playwright script that captures the Features page screenshots from the
// CCF Meridian showcase. Run it through ./screenshots.sh, which fills in the
// CONFIG placeholder below. Like the video script, it only reads.
//
// Each shot is clipped to the main column (the sidebar is left out), and the
// floating theme toggle and sidebar collapse button are hidden.
async page => {
  const CONFIG = __CONFIG__;
  const BASE = CONFIG.baseUrl;
  const OUT = CONFIG.outDir.replace(/\/?$/, '/');
  const W = ms => page.waitForTimeout(ms);
  const SIDEBAR = 330;           // main column starts here
  const WIDTH = 1440;

  const hideChrome = () => page.evaluate(() => {
    for (const label of ['Toggle theme', 'Toggle sidebar']) {
      document.querySelectorAll(`button[aria-label="${label}"]`).forEach(b => { b.style.visibility = 'hidden'; });
    }
  });
  const settle = async () => {
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.mouse.move(5, 5);
    await W(1200);
    await hideChrome();
  };
  const go = async (path) => { await page.goto(BASE + path); await settle(); };
  const shot = (name, clip) => page.screenshot({ path: OUT + name + '.png', clip });
  // Main column from `top` down to `bottom` (page coordinates).
  const main = (top, bottom) => ({ x: SIDEBAR, y: top, width: WIDTH - SIDEBAR, height: Math.round(bottom - top) });
  const bottomOf = async (locator, pad = 24) => {
    const b = await locator.boundingBox();
    if (!b) throw new Error('not visible: ' + locator);
    return b.y + b.height + pad;
  };
  const expand = async (name) => {
    const item = page.getByRole('treeitem', { name, exact: true }).first();
    await item.waitFor();
    if ((await item.getAttribute('aria-expanded')) !== 'true') await item.getByRole('button').first().click();
    await W(800);
  };

  await page.setViewportSize({ width: WIDTH, height: 900 });
  await page.context().clearCookies();
  await go('/auth/login');
  await page.getByRole('textbox', { name: 'Email' }).fill(CONFIG.email);
  await page.getByRole('textbox', { name: 'Password' }).fill(CONFIG.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await page.waitForURL(/\/evidence/);
  await W(6000); // let the "Login Successful" toast fade

  // Work in the Customer Portal system.
  await page.getByRole('combobox', { name: 'Active system' }).click();
  await page.getByText('Meridian Customer Portal System Security Plan').last().click();
  await settle();

  // Evidence list filtered by labels to the GitHub checks, so the
  // search box shows a label query and the rows are a mix of pass and fail.
  await go('/evidence?filter=' + encodeURIComponent('provider=github').replace(/%20/g, '+'));
  await shot('evidence', main(0, 820));

  // A failing check: status, signature, tabs.
  // The list re-sorts as new evidence arrives, so page through it if needed.
  const failing = page.getByRole('link', { name: /Open evidence Default repository permission/ }).first();
  for (let i = 0; i < 5 && !(await failing.count()); i++) {
    await page.getByRole('button', { name: 'Next' }).click();
    await settle();
  }
  await failing.click();
  await settle();
  await shot('evidence-detail', main(100, 636));

  // Per-system compliance against one profile.
  await go('/compliance');
  await page.getByRole('button', { name: /Identity Controls/ }).first().click();
  await settle();
  await page.setViewportSize({ width: WIDTH, height: 1300 });
  await settle();
  await shot('compliance', main(90, await bottomOf(page.getByText('INT-SSO').first(), 60)));
  await page.setViewportSize({ width: WIDTH, height: 900 });

  // Compliance map, drilled down to one control and its first risks.
  await go('/lineage');
  await expand('Meridian Secure Delivery & Resilience Policy');
  await expand('Infrastructure Resilience Policy');
  await expand('Meridian Internal Controls — Resilience');
  await expand('Production workloads span multiple availability zones');
  await settle();
  const risks = page.getByRole('treeitem', { name: /^Application payments\/legacy-batch/ });
  await shot('compliance-map', main(100, await bottomOf(risks.nth(1), 10)));

  // The same control across every system.
  await page.getByRole('treeitem', { name: 'Production workloads span multiple availability zones' })
    .getByText('Production workloads span multiple availability zones').first().click();
  await settle();
  await shot('control-status', { x: 576, y: 0, width: WIDTH - 576, height: 600 });
  await page.keyboard.press('Escape');
  await W(500);

  // Risk dashboard.
  await go('/risks');
  await shot('risks', main(90, 760));

  // Scheduled workflows.
  await go('/workflow-instances');
  await shot('workflows', main(90, 700));

  // A catalog: the Meridian corporate standard, with two groups opened.
  await go('/catalogs');
  await page.getByRole('row', { name: /Meridian Corporate Security Standard/ })
    .getByRole('link', { name: 'View' }).click();
  await settle();
  for (const group of ['Identity & Access Management', 'Operational Resilience']) {
    await page.getByText(group, { exact: true }).first().click();
    await W(1000);
  }
  await settle();
  await shot('catalog', main(90, await bottomOf(page.getByText('Secure Delivery', { exact: true }).first(), 34)));

  return { outDir: OUT };
}
