import rss from "@astrojs/rss";
export async function GET() {
  let allPosts = import.meta.glob("./posts/*.md", { eager: true });
  let posts = Object.values(allPosts);

  posts = posts.sort((a, b) => {
    // 从URL中提取日期（YYYYMMDD格式）
    const getDateStr = (url) => url.split("/posts/")[1];
    // 直接使用字符串比较，降序排列
    return getDateStr(b.url).localeCompare(getDateStr(a.url));
  });

  // Only 12 are kept
  posts = posts.slice(0, 12);

  // 处理 Markdown 内容，返回不过滤的标签的原始内容
  const processContent = async (item) => {
    const content = await item.compiledContent();
    return content;
  };

  return rss({
    title: "Product Hunt 日报",
    description: "Product Hunt 每日精华",
    site: "https://product-daily.haha.ai/",
    customData: `<image><url>https://gw.alicdn.com/imgextra/i2/O1CN01m9YYjS1QBeW5DOm3I_!!6000000001938-2-tps-400-400.png</url></image>`,
    items: await Promise.all(
      posts.map(async (item) => {
        // 从URL中提取日期（YYYYMMDD格式）
        const dateStr = item.url.split("/posts/")[1];

        // 格式化日期为标题
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);

        // 构建标题: 第YYYY年MM月DD日热榜
        const title = `${year}年${month}月${day}日热榜`;

        return {
          link: item.url,
          title,
          description: await processContent(item),
          pubDate: item.frontmatter.date,
        };
      }),
    ),
  });
}
