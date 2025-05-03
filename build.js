import { promises as fs } from 'fs';
import axios from 'axios';

async function fetchCiTime(filePath) {
  const url = `https://api.github.com/repos/xpzouying/producthunt-weekly/commits?path=${filePath}&page=1&per_page=1`;
  const response = await axios.get(url);
  const ciTime = response.data[0].commit.committer.date.split('T')[0];
  return ciTime;
}

async function main() {
  const readmeContent = "# Product Hunt 日报\n\n> Product Hunt 每日精华，由邹颖整理。欢迎订阅和交流。\n\n";

  const files = await fs.readdir('./src/pages/posts');
  const mdFiles = files
    .filter(file => file.endsWith('.md'))
    .sort((a, b) => {
      const dateA = a.split('.md')[0];
      const dateB = b.split('.md')[0];
      return dateB.localeCompare(dateA);
    });

  const posts = [];
  let recentContent = '';
  let readmeContent2 = '';

  for (let i = 0; i < mdFiles.length; i++) {
    const name = mdFiles[i];
    const filePath = encodeURIComponent(name);
    const dateStr = name.split('.md')[0];

    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);

    const url = `https://product-daily.haha.ai/posts/${dateStr}`;

    const title = `${year}年${month}月${day}日热榜`;

    posts.push({ date: dateStr, title: title, url });
    readmeContent2 += `* [${title}](${url})\n`;

    if (i < 5) {
      const modified = await fetchCiTime(`/src/pages/posts/${filePath}`);
      recentContent += `* [${title}](${url}) - ${modified}\n`;
    }
  }

  await Promise.all([
    fs.writeFile('README.md', readmeContent + readmeContent2),
    fs.writeFile('RECENT.md', recentContent),
    fs.writeFile('posts.json', JSON.stringify(posts, null, 2))
  ]);
}

main().catch(console.error);
