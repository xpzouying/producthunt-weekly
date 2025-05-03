// Helper function to extract and decode the title part from the URL
const extractTitlePart = (currentPage: string) => {
  return decodeURIComponent(currentPage.split("/posts/")[1]);
};

// Convert to title
export const parseTitle = (currentPage: string) => {
  const dateStr = extractTitlePart(currentPage);

  // 格式化日期为标题
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);

  // 构建标题: 第YYYY年MM月DD日热榜
  let title = `${year}年${month}月${day}日`;

  if (title.endsWith("/")) {
    title = title.slice(0, -1);
  }
  return title;
};

// Get the date string from the URL (YYYYMMDD)
export const getIndex = (currentPage: string) => {
  const dateStr = extractTitlePart(currentPage);
  // 返回日期字符串，可以用于排序
  return dateStr;
};

// Sort all articles.
export const sortPosts = (allPosts: any) => {
  return allPosts.sort((a, b) => {
    // 直接比较日期字符串，降序排列
    const getDateFromUrl = (url: string) => extractTitlePart(url);
    return getDateFromUrl(b.url).localeCompare(getDateFromUrl(a.url));
  });
};
