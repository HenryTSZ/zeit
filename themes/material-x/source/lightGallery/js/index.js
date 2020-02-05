let articleInit = function() {
  $('.article-entry img').each(function() {
    let imgPath = $(this).attr('src')
    $(this).wrap('<div class="img-item" data-src="' + imgPath + '" data-sub-html=".caption"></div>')
    $(this).addClass('img')
    // 图片添加字幕
    let alt = $(this).attr('alt')
    let title = $(this).attr('title')
    let captionText = alt || title
    // 字幕不空，添加之
    if (captionText) {
      let captionDiv = document.createElement('div')
      captionDiv.className = 'caption'
      let captionEle = document.createElement('b')
      captionEle.className = 'center-caption'
      captionEle.innerText = captionText
      captionDiv.appendChild(captionEle)
      this.insertAdjacentElement('afterend', captionDiv)
    }
  })
  $('.article-entry, #myGallery').lightGallery({
    selector: '.img-item',
    // 启用字幕
    subHtmlSelectorRelative: true
  })
}
articleInit()
