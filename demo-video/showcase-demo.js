// Playwright scene script for the CCF Meridian showcase demo video.
//
// Run it through ./record.sh, which fills in the CONFIG placeholder below
// (UI URL, login, output path and narration clip lengths) and hands the
// result to `playwright-cli run-code`. The script only reads: it never
// executes workflows, reassigns roles or changes risks, so the showcase
// data is left as it was.
//
// Locators and captions assume the data seeded by `make demo-up-showcase` in
// the local-dev repo (Meridian Customer Portal, the AZ resilience control,
// the "Default repository permission" GitHub check, and so on).
//
// Narration: narrate(id) starts the line with that id from narration.json
// and returns a handle; `await handle.done()` waits until the line has
// finished. Put the on-screen actions for a line between the two, so the
// picture never runs ahead of the voice. The scene returns when each line
// started, and record.sh lays the audio down at those times.
async page => {
  const CONFIG = __CONFIG__;
  const BASE = CONFIG.baseUrl;
  const W = ms => page.waitForTimeout(ms);
  const FONT = '-apple-system,Segoe UI,Helvetica,Arial,sans-serif';

  // --- Narration ----------------------------------------------------------
  const clips = CONFIG.clips || {};   // id -> length in ms; empty when silent
  const voiced = Object.keys(clips).length > 0;
  const marks = [];
  let t0 = Date.now();
  const narrate = (id) => {
    if (!voiced) return { done: async () => {} };
    const ms = clips[id];
    if (ms === undefined) throw new Error(`no narration line "${id}" in narration.json`);
    const start = Date.now();
    marks.push({ id, at: start - t0 });
    return {
      // pad: a short breath after the line before the next one starts.
      done: async (pad = 450) => {
        const left = start + ms + pad - Date.now();
        if (left > 0) await W(left);
      },
    };
  };

  // --- Overlays -----------------------------------------------------------
  // Caption bar along the bottom of the frame. Pass null to clear it.
  let cap = null;
  const caption = async (text) => {
    if (cap) { await cap.dispose(); cap = null; }
    if (!text) return;
    cap = await page.screencast.showOverlay(`
      <div style="position:absolute;left:50%;bottom:28px;transform:translateX(-50%);
        max-width:1000px;padding:14px 24px;background:rgba(15,23,42,.88);color:#fff;
        border-radius:12px;font:500 20px/1.4 ${FONT};
        text-align:center;box-shadow:0 8px 30px rgba(0,0,0,.25)">${text}</div>`);
  };

  // Full-screen title card between sections, held for at least `ms` and
  // for as long as its narration line runs.
  const chapter = async (title, desc, id, ms = 3000) => {
    await caption(null);
    const card = await page.screencast.showOverlay(`
      <div style="position:fixed;inset:0;background:linear-gradient(135deg,rgba(15,23,42,.94),rgba(30,58,138,.92));
        display:flex;flex-direction:column;align-items:center;justify-content:center;
        font-family:${FONT};color:#fff;text-align:center;padding:0 120px">
        <div style="font-size:18px;letter-spacing:.18em;text-transform:uppercase;color:#93c5fd;margin-bottom:18px">Continuous Compliance Framework</div>
        <div style="font-size:60px;font-weight:700;line-height:1.1">${title}</div>
        <div style="font-size:26px;margin-top:22px;max-width:1000px;color:#e2e8f0;line-height:1.4">${desc}</div>
      </div>`);
    const n = narrate(id);
    await W(ms);
    await n.done(250);
    await card.dispose();
  };

  // --- Page helpers -------------------------------------------------------
  const scroll = async (dy, steps = 8, x = 880, y = 500) => {
    await page.mouse.move(x, y);
    for (let i = 0; i < steps; i++) { await page.mouse.wheel(0, dy / steps); await W(60); }
  };

  // Click a sidebar link, opening its collapsed group first if needed.
  const nav = async (href, group) => {
    const link = page.locator(`a[href="${href}"]`).first();
    if (!(await link.isVisible()) && group) {
      await page.getByText(group, { exact: true }).first().click();
      await W(700);
    }
    if (await link.isVisible()) await link.click();
    else await page.goto(BASE + href);
    await page.waitForLoadState('networkidle').catch(() => {});
    await W(800);
  };

  // Expand a Compliance Map tree node, leaving it alone if already open.
  const expand = async (name) => {
    const item = page.getByRole('treeitem', { name, exact: true }).first();
    await item.waitFor({ timeout: 10000 });
    if ((await item.getAttribute('aria-expanded')) !== 'true') {
      await item.getByRole('button').first().click();
    }
    await W(1600);
  };

  // Nice-to-have steps: note the failure and carry on rather than abort the
  // recording. record.sh reports anything skipped.
  const skipped = [];
  const tryStep = async (fn) => {
    try { await fn(); } catch (e) { skipped.push(e.message.split('\n')[0]); }
  };

  // --- Scenes -------------------------------------------------------------
  // Start logged out, on the login page.
  await page.context().clearCookies();
  await page.goto(BASE + '/auth/logout').catch(() => {});
  await page.goto(BASE + '/auth/login');
  await page.waitForLoadState('networkidle').catch(() => {});

  await page.screencast.start({ path: CONFIG.out, size: { width: 1440, height: 900 }, fps: 30 });
  t0 = Date.now();
  let n;
  try {
    await page.screencast.showActions({
      duration: 700,
      style: {
        point: 'width:22px;height:22px;border-radius:50%;background:rgba(37,99,235,.55)',
        title: 'display:none',
      },
    });

    // 1. Intro
    await W(500);
    await chapter('Meridian Financial Group',
      'A demo of continuous compliance across ten systems, with live evidence from GitHub and Kubernetes',
      'intro', 4000);

    // 2. Login
    await caption('Sign in with a local account, or SSO through Google, LDAP or GitHub');
    n = narrate('login');
    await page.getByRole('textbox', { name: 'Email' }).pressSequentially(CONFIG.email, { delay: 45 });
    await page.getByRole('textbox', { name: 'Password' }).pressSequentially(CONFIG.password, { delay: 60 });
    await n.done();
    await page.getByRole('button', { name: 'Login' }).click();
    await page.waitForURL(/\/evidence/);
    await page.waitForLoadState('networkidle').catch(() => {});
    await W(1200);

    // 3. Evidence
    await chapter('Evidence',
      'Agents and plugins collect evidence continuously from GitHub, Kubernetes and PAM tools',
      'evidence-chapter');
    await caption('Each check is stored as evidence with a pass/fail status, labels and a timestamp');
    n = narrate('evidence-list');
    await W(2500);
    await scroll(500);
    await n.done();
    await caption('Open a failing check to see what it tests and what failed');
    n = narrate('evidence-open');
    await W(1500);
    await page.getByRole('link', { name: /Open evidence Default repository permission/ }).first().click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await n.done();
    await caption('Evidence is signed and keeps its history. Failures can raise risks and tasks');
    n = narrate('evidence-detail');
    await W(4000);
    await tryStep(async () => { await page.getByRole('button', { name: 'History' }).click(); await W(2500); });
    await n.done();
    await tryStep(async () => { await page.getByRole('button', { name: 'Overview' }).click(); await W(600); });

    // 4. Systems: pick the Customer Portal SSP, then its Compliance and Implementation pages
    await chapter('Systems', 'Each system has its own System Security Plan (SSP)', 'systems-chapter');
    await caption('Pick a system to work in. Here: the Meridian Customer Portal');
    n = narrate('pick-system');
    await page.getByRole('combobox', { name: 'Active system' }).click();
    await W(1800);
    await page.getByText('Meridian Customer Portal System Security Plan').last().click();
    await n.done();

    await nav('/compliance');
    await caption('How the Customer Portal measures up against each of its control profiles');
    n = narrate('compliance');
    await W(3500);
    await tryStep(async () => {
      await page.getByRole('button', { name: /Identity Controls/ }).first().click();
      await page.waitForLoadState('networkidle').catch(() => {});
      await W(2500);
    });
    await scroll(700);
    await n.done();
    await W(800);
    await scroll(-700);

    await nav('/controls');
    await caption('Implementation: how each control in the profiles is implemented for this system');
    n = narrate('implementation');
    await W(3000);
    await n.done();

    // 5. Compliance map: standard -> policy -> control -> evidence and risks
    await chapter('Compliance Map', 'From corporate standard to policy, to internal control, to live evidence',
      'map-chapter');
    await nav('/lineage', 'Analysis');
    await caption('Every node rolls up compliance and open risk from the nodes below it');
    n = narrate('map-tree');
    await W(2500);
    await n.done();
    await caption('Drill down: Policy → Infrastructure Resilience → Resilience controls');
    n = narrate('map-drill');
    await expand('Meridian Secure Delivery & Resilience Policy');
    await expand('Infrastructure Resilience Policy');
    await expand('Meridian Internal Controls — Resilience');
    await expand('Production workloads span multiple availability zones');
    await n.done();
    await caption('This control is 71% met. The failures are linked to risks, such as the single-AZ legacy batch job');
    n = narrate('map-control');
    await W(3500);
    await n.done();
    await page.getByRole('treeitem', { name: 'Production workloads span multiple availability zones' })
      .getByText('Production workloads span multiple availability zones').first().click();
    await W(800);
    await caption('The same control across all ten systems: which pass, which fail, which are out of scope');
    n = narrate('map-panel');
    await W(3500);
    await scroll(500, 8, 1000, 500);
    await n.done();
    await W(800);
    await page.keyboard.press('Escape');
    // Escape usually closes the panel already; the Close click is only a fallback.
    await page.getByRole('button', { name: 'Close' }).last().click({ timeout: 1500 }).catch(() => {});
    await W(800);

    await caption('The Graph view orders nodes by open risk, worst first');
    n = narrate('map-graph');
    await page.getByRole('button', { name: 'Graph' }).click();
    await W(2500);
    await tryStep(async () => {
      await page.getByText('children ›').first().click({ timeout: 3000 });
      await W(2500);
    });
    await n.done();
    await W(800);
    await page.getByRole('button', { name: 'Tree' }).click();
    await W(600);

    // 6. Risks
    await chapter('Risks', 'A risk register for each system, fed by failing evidence', 'risks-chapter');
    await nav('/risks');
    await caption('Risk posture for the Customer Portal: status breakdown and a likelihood × impact heatmap');
    n = narrate('risks-dashboard');
    await W(3500);
    await scroll(450);
    await n.done();
    await W(800);
    await scroll(-450);
    await page.getByRole('tab', { name: 'Register' }).click()
      .catch(() => page.getByText('Register', { exact: true }).click());
    await W(1000);
    await caption('The register: filter, open, accept with justification, or promote to a POA&M');
    n = narrate('risks-register');
    await W(2500);
    await scroll(600);
    await n.done();

    // 7. Workflows (viewed only; nothing is executed)
    await chapter('Workflows',
      'Recurring human processes such as access reviews and DR exercises, recorded as evidence',
      'workflows-chapter');
    await nav('/workflow-instances');
    await caption('Scheduled workflows for each system, each with a cadence and owners');
    n = narrate('workflow-list');
    await W(3000);
    await n.done();
    await page.locator('a[href^="/workflow-instances/"]', { hasText: 'View' }).first().click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await W(800);
    await caption('Quarterly access review for the Workforce Identity Provider. Completing each step produces evidence');
    n = narrate('workflow-detail');
    await W(3000);
    await tryStep(async () => { await page.getByText('Role Assignments', { exact: false }).first().click(); await W(2500); });
    await tryStep(async () => { await page.getByText('Executions', { exact: true }).first().click(); await W(2000); });
    await n.done();

    // 8. Outro
    await chapter('Compliance, continuously',
      'Evidence collected continuously and mapped from controls to policies to standards',
      'outro', 4500);
    await W(700);
  } finally {
    await caption(null);
    await page.screencast.stop();
  }
  return { out: CONFIG.out, skipped, marks };
}
