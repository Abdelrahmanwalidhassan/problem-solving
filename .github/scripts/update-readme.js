import fs from "fs";
import path from "path";

const root = process.cwd();
const readmePath = path.join(root, "README.md");

const platforms = {
  leetcode: "LeetCode",
  codeforces: "Codeforces",
  // atcoder: "AtCoder",
  // icpc: "ICPC",
};

function countSolutions(folder) {
  let count = 0;
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (/\.(cpp|py|js|ts)$/i.test(full)) {
        count++;
      }
    }
  }
  walk(folder);
  return count;
}

function updateProgressTable() {
  const stats = {};
  for (const key in platforms) {
    const folder = path.join(root, key);
    stats[platforms[key]] = countSolutions(folder);
  }

  let readme = fs.readFileSync(readmePath, "utf-8");

  // const tablePattern = /(\| Platform\s+\|.*?\| In Progress \|\n)(\|.*\n)+/s;
  const tablePattern = /\| Platform\s+\|.*?\| In Progress \|[\r\n]+(?:\|.*[\r\n]+)+/s;

  const newTable = `| Platform   | Solved | In Progress |
|------------|--------|-------------|
| LeetCode   | ${stats["LeetCode"]}   | 🔄 Updating |
| Codeforces | ${stats["Codeforces"]}   | 🔄 Updating |
`;
  // | AtCoder    | ${stats["AtCoder"]}   | 🔄 Updating |
  // | ICPC       | ${stats["ICPC"]}   | 🔄 Updating |

  readme = readme.replace(tablePattern, newTable);

  fs.writeFileSync(readmePath, readme);
  console.log("✅ README progress table updated!");
}

updateProgressTable();
