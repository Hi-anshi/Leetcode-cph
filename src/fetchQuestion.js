const axios = require("axios");
const fs = require("fs");
const path = require("path");

// GraphQL query to fetch problem details from LeetCode
const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const FETCH_PROBLEM_QUERY = `
  query questionData($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      title
      content
      sampleTestCase
      codeSnippets {
        lang
        langSlug
        code
      }
    }
  }
`;

// Function to extract the titleSlug from the problem URL
function getTitleSlug(url) {
  const match = url.match(/leetcode\.com\/problems\/([\w-]+)\/?/);
  if (!match) throw new Error("Invalid LeetCode problem URL.");
  return match[1];
}

// Function to fetch test cases from LeetCode
module.exports = async function fetchTestCases(url) {
  try {
    const titleSlug = getTitleSlug(url);

    // Perform the GraphQL request
    const response = await axios.post(LEETCODE_GRAPHQL_ENDPOINT, {
      query: FETCH_PROBLEM_QUERY,
      variables: { titleSlug },
    });

    const problemData = response.data.data.question;

    if (!problemData) throw new Error("Problem data not found.");

    const { title, sampleTestCase } = problemData;

    console.log(`Fetched problem: ${title}`);

    // Save the sample test case locally
    const outputDir = path.join(__dirname, "test_cases", titleSlug);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const inputs = sampleTestCase.split("\n").filter((_, i) => i % 2 === 0); // Assuming alternating input/output lines
    const outputs = sampleTestCase.split("\n").filter((_, i) => i % 2 !== 0);

    inputs.forEach((input, idx) => {
      fs.writeFileSync(path.join(outputDir, `input_${idx + 1}.txt`), input);
      fs.writeFileSync(path.join(outputDir, `output_${idx + 1}.txt`), outputs[idx] || "");
    });

    console.log(`Test cases saved in: ${outputDir}`);
  } catch (error) {
    console.error(`Error fetching test cases: ${error.message}`);
  }
}

// Example usage
// Replace with a valid LeetCode problem URL
// fetchTestCases("https://leetcode.com/problems/two-sum/");
