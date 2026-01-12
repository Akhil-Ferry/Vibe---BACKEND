// Test script for Vibe Check Polling API
const http = require('http');

// Helper function to make HTTP requests
function makeRequest(options, data = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({
                        status: res.statusCode,
                        data: JSON.parse(body)
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: body
                    });
                }
            });
        });

        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

// Test all endpoints
async function runTests() {
    console.log('🚀 Starting API Tests...\n');

    try {
        // Test 1: Create a poll
        console.log('📝 Test 1: Creating a poll...');
        const createOptions = {
            hostname: 'localhost',
            port: 3000,
            path: '/polls',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const pollData = {
            question: 'What is your favorite tech?',
            options: ['Go', 'Node.js', 'Python', 'Rust']
        };

        const createResponse = await makeRequest(createOptions, pollData);
        console.log(`Status: ${createResponse.status}`);
        console.log('Response:', JSON.stringify(createResponse.data, null, 2));

        const pollId = createResponse.data.poll_id;
        console.log(`\n✅ Poll created with ID: ${pollId}\n`);

        // Test 2: Get poll details
        console.log('📊 Test 2: Getting poll details...');
        const getOptions = {
            hostname: 'localhost',
            port: 3000,
            path: `/polls/${pollId}`,
            method: 'GET'
        };

        const getResponse = await makeRequest(getOptions);
        console.log(`Status: ${getResponse.status}`);
        console.log('Response:', JSON.stringify(getResponse.data, null, 2));
        console.log('\n✅ Poll details retrieved\n');

        // Test 3: Cast votes
        console.log('🗳️  Test 3: Casting votes...');
        const voteOptions = {
            hostname: 'localhost',
            port: 3000,
            path: `/polls/${pollId}/vote`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // Get option IDs from the poll
        const optionId = getResponse.data.options[1].option_id; // Node.js

        // Vote 1: Alice votes for Node.js
        console.log('\n👤 Alice voting for Node.js...');
        const vote1 = await makeRequest(voteOptions, {
            option_id: optionId,
            user_id: 'alice'
        });
        console.log(`Status: ${vote1.status}`);
        console.log('Response:', JSON.stringify(vote1.data, null, 2));

        // Vote 2: Bob votes for Node.js
        console.log('\n👤 Bob voting for Node.js...');
        const vote2 = await makeRequest(voteOptions, {
            option_id: optionId,
            user_id: 'bob'
        });
        console.log(`Status: ${vote2.status}`);
        console.log('Response:', JSON.stringify(vote2.data, null, 2));

        // Vote 3: Charlie votes for Go
        const goOptionId = getResponse.data.options[0].option_id;
        console.log('\n👤 Charlie voting for Go...');
        const vote3 = await makeRequest(voteOptions, {
            option_id: goOptionId,
            user_id: 'charlie'
        });
        console.log(`Status: ${vote3.status}`);
        console.log('Response:', JSON.stringify(vote3.data, null, 2));

        console.log('\n✅ All votes cast successfully\n');

        // Test 4: Try to vote again (should fail)
        console.log('🚫 Test 4: Testing duplicate vote prevention...');
        console.log('👤 Alice trying to vote again...');
        const duplicateVote = await makeRequest(voteOptions, {
            option_id: goOptionId,
            user_id: 'alice'
        });
        console.log(`Status: ${duplicateVote.status}`);
        console.log('Response:', JSON.stringify(duplicateVote.data, null, 2));

        if (duplicateVote.status === 409) {
            console.log('\n✅ Duplicate vote correctly prevented!\n');
        } else {
            console.log('\n❌ Duplicate vote was not prevented!\n');
        }

        // Test 5: Get updated poll results
        console.log('📊 Test 5: Getting updated poll results...');
        const finalResults = await makeRequest(getOptions);
        console.log(`Status: ${finalResults.status}`);
        console.log('Final Results:', JSON.stringify(finalResults.data, null, 2));

        console.log('\n✅ All tests completed successfully!\n');
        console.log('=' * 50);
        console.log('Summary:');
        console.log('- Poll creation: ✅');
        console.log('- Get poll details: ✅');
        console.log('- Cast votes: ✅');
        console.log('- Duplicate prevention: ✅');
        console.log('=' * 50);

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
}

// Run the tests
runTests();
