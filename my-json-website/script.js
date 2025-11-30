
    async function renderWebsite() {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('JSON文件加载失败');
    const data = await response.json();

    // 1. 渲染网站标题
    document.getElementById('siteTitle').textContent = data.siteConfig.title;

    // 2. 渲染导航栏
    const nav = document.getElementById('navigation');
    const navList = document.createElement('ul');
    data.navigation.forEach(item => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.name;
      li.appendChild(a);
      navList.appendChild(li);
    });
    nav.appendChild(navList);

    // 3. 渲染首页横幅
    const banner = document.getElementById('home');
    banner.innerHTML = `
      <h1>${data.homeBanner.title}</h1>
      <p>${data.homeBanner.subtitle}</p>
      <a href="${data.homeBanner.btnHref}"><button>${data.homeBanner.btnText}</button></a>
    `;

    // 4. 渲染文章列表
    const articleSection = document.getElementById('articles');
    articleSection.innerHTML = `<h2>文章列表</h2>`;
    data.articles.forEach(article => {
      const articleCard = document.createElement('div');
      articleCard.className = 'article-card';
      articleCard.innerHTML = `
        <h3>${article.title}</h3>
        <div class="article-meta">${article.date} · ${article.author}</div>
        <p>${article.summary}</p>
      `;
      articleSection.appendChild(articleCard);
    });

    // 新增：5. 渲染漫画专区
    const comicsSection = document.getElementById('comics');
    comicsSection.innerHTML = `<h2>漫画专区（跳转正版官方）</h2>`;
    const comicsGrid = document.createElement('div');
    comicsGrid.className = 'comics-grid';
    
    data.comics.forEach(comic => {
      const comicCard = document.createElement('div');
      comicCard.className = 'comic-card';
      // 点击卡片整体也能跳转（和按钮跳转一致）
      comicCard.onclick = () => window.open(comic.officialUrl, '_blank');
      
      // 渲染漫画标签（如「热血」「冒险」）
      const tagsHtml = comic.tags.map(tag => `<span class="comic-tag">${tag}</span>`).join('');
      
      comicCard.innerHTML = `
        <img src="${comic.cover}" alt="${comic.title}封面" class="comic-cover">
        <div class="comic-info">
          <h3>${comic.title}</h3>
          <div class="comic-author">作者：${comic.author}</div>
          <div class="comic-tags">${tagsHtml}</div>
          <a href="${comic.officialUrl}" target="_blank" class="read-btn">立即阅读</a>
        </div>
      `;
      comicsGrid.appendChild(comicCard);
    });
    comicsSection.appendChild(comicsGrid);

    // 6. 渲染关于我们
    const aboutSection = document.getElementById('about');
    const aboutContent = data.about.content.map(text => `<li>${text}</li>`).join('');
    aboutSection.innerHTML = `
      <h2>${data.about.title}</h2>
      <div class="content">
        <ul>${aboutContent}</ul>
        <div class="contact">
          邮箱：${data.about.contact.email}<br>
          GitHub：${data.about.contact.github}
        </div>
      </div>
    `;

    // 7. 渲染页脚
    const footer = document.getElementById('footer');
    footer.textContent = data.siteConfig.footerText;

  } catch (error) {
    console.error('网站渲染失败：', error);
    document.body.innerHTML = `<h1 style="text-align:center; margin-top: 2rem;">页面加载失败，请刷新重试</h1>`;
  }
}

window.addEventListener('DOMContentLoaded', renderWebsite);
