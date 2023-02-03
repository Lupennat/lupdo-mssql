// testSequencer.js
const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    sort(tests) {
        const copyTests = Array.from(tests);
        return copyTests.sort((testA, testB) => {
            return testA.path.endsWith('mssql-kill.test.ts') ? 1 : testB.path.endsWith('mssql-kill.test.ts') ? -1 : 0;
        });
    }
}

module.exports = CustomSequencer;
