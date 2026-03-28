import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const AUDIT_SCRIPT = 'scripts/audit_shapeof_parity.mjs';
const AUDIT_OUTPUT = 'scripts/audit_shapeof_parity.output.json';

const FIX_SEQUENCE = [
  ['scripts/sync_shapeof_text_parity.mjs'],
  ['scripts/merge_dual_source_content.mjs'],
  ['scripts/normalize_pattern_content.mjs'],
  ['scripts/sync_source_images.mjs', '--apply'],
  ['scripts/normalize_pattern_content.mjs'],
];

function runNodeScript(scriptAndArgs) {
  const [script, ...args] = scriptAndArgs;
  process.stdout.write(`\n[run] node ${script} ${args.join(' ')}\n`);

  const result = spawnSync(process.execPath, [script, ...args], {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error(`Command failed: node ${script} ${args.join(' ')}`.trim());
  }
}

function readAuditSummary() {
  if (!existsSync(AUDIT_OUTPUT)) {
    throw new Error(`Missing audit output at ${AUDIT_OUTPUT}`);
  }

  const report = JSON.parse(readFileSync(AUDIT_OUTPUT, 'utf8'));
  return {
    total: report.total ?? 0,
    passCount: report.passCount ?? 0,
    failCount: report.failCount ?? 0,
    errorCount: report.errorCount ?? 0,
  };
}

function parseArgs(argv) {
  const arg = argv.find((item) => item.startsWith('--max-passes='));
  const maxPasses = arg ? Number(arg.replace('--max-passes=', '')) : 2;

  if (!Number.isInteger(maxPasses) || maxPasses < 1) {
    throw new Error('Expected --max-passes to be an integer >= 1');
  }

  return { maxPasses };
}

function printSummary(summary, label) {
  process.stdout.write(
    `[summary:${label}] total=${summary.total} pass=${summary.passCount} fail=${summary.failCount} error=${summary.errorCount}\n`
  );
}

async function main() {
  const { maxPasses } = parseArgs(process.argv.slice(2));

  process.stdout.write(`[info] Starting parity remediation with maxPasses=${maxPasses}\n`);

  runNodeScript([AUDIT_SCRIPT]);
  let summary = readAuditSummary();
  printSummary(summary, 'initial');

  if (summary.failCount === 0 && summary.errorCount === 0) {
    process.stdout.write('[info] No remediation required.\n');
    return;
  }

  for (let pass = 1; pass <= maxPasses; pass += 1) {
    process.stdout.write(`\n[pass ${pass}] Running remediation sequence\n`);

    for (const command of FIX_SEQUENCE) {
      runNodeScript(command);
    }

    runNodeScript([AUDIT_SCRIPT]);
    summary = readAuditSummary();
    printSummary(summary, `pass-${pass}`);

    if (summary.failCount === 0 && summary.errorCount === 0) {
      process.stdout.write('[info] Parity remediation completed successfully.\n');
      return;
    }
  }

  throw new Error(
    `Remediation ended with fail=${summary.failCount} error=${summary.errorCount}. Increase --max-passes or inspect failing patterns manually.`
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
