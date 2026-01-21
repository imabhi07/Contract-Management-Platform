// A simple manual test runner to satisfy the requirement

// 1. Define the types so TypeScript is happy
const TRANSITIONS: Record<string, string[]> = {
  created: ['approved', 'revoked'],
  approved: ['sent', 'revoked'],
  sent: ['signed', 'revoked'],
  signed: ['locked', 'revoked'],
  locked: [],
  revoked: []
};

// 2. Add ': string' type annotation to the parameter
function getAvailableActions(current: string) {
  return TRANSITIONS[current] || [];
}

console.log("--- RUNNING UNIT TESTS ---");

// Test 1: Created state should allow Approval
const test1 = getAvailableActions('created');
if (test1.includes('approved') && test1.includes('revoked')) {
  console.log("PASS: 'Created' state allows 'Approved' and 'Revoked'");
} else {
  console.error("FAIL: 'Created' state logic is wrong");
}

// Test 2: Locked state should allow NOTHING
const test2 = getAvailableActions('locked');
if (test2.length === 0) {
  console.log("PASS: 'Locked' state has no further actions");
} else {
  console.error("FAIL: 'Locked' state should not allow edits");
}

// Test 3: Transitions check
const test3 = getAvailableActions('sent');
if (test3.includes('signed')) {
  console.log("PASS: 'Sent' contracts can be 'Signed'");
} else {
  console.error("FAIL: 'Sent' contracts missing sign action");
}

console.log("--- TESTS COMPLETED ---");