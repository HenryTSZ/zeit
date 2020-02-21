/* eslint-disable */
var SearchService = ''

;(function($) {
  /**
   * A super class of common logics for all search services
   * @param options : (object)
   */
  SearchService = function(options) {
    var self = this

    self.config = $.extend(
      {
        selectors: {
          body: 'body',
          form: '.u-search-form',
          input: '.u-search-input',
          container: '#u-search',
          modal_body: '#u-search .modal-body',
          modal_overlay: '#u-search .modal-overlay',
          modal_results: '#u-search .modal-results',
          google_search: '#u-search .google-search',
          baidu_search: '#u-search .baidu-search',
          modal_loading_bar: '#u-search .modal-loading-bar',
          btn_close: '#u-search .btn-close'
        },
        imagePath: ROOT + 'img/'
      },
      options
    )

    self.dom = {}
    self.percentLoaded = 0
    self.open = false
    self.queryText = ''

    self.parseSelectors = function() {
      for (var key in self.config.selectors) {
        self.dom[key] = $(self.config.selectors[key])
      }
    }

    self.beforeQuery = function() {
      if (!self.open) {
        self.dom.container.fadeIn()
        self.dom.body.addClass('modal-active')
      }
      self.dom.input.each(function(index, elem) {
        $(elem).val(self.queryText)
      })
      document.activeElement.blur()
      self.startLoading()
    }

    self.afterQuery = function() {
      self.dom.modal_body.scrollTop(0)
      self.stopLoading()
    }

    /**
     * Start loading bar animation
     * no param
     */
    self.startLoading = function() {
      self.dom.modal_loading_bar.show()
      self.loadingTimer = setInterval(function() {
        self.percentLoaded = Math.min(self.percentLoaded + 5, 95)
        self.dom.modal_loading_bar.css('width', self.percentLoaded + '%')
      }, 100)
    }

    /**
     * Stop loading bar animation
     * no param
     */
    self.stopLoading = function() {
      clearInterval(self.loadingTimer)
      self.dom.modal_loading_bar.css('width', '100%')
      self.dom.modal_loading_bar.fadeOut()
      setTimeout(function() {
        self.percentLoaded = 0
        self.dom.modal_loading_bar.css('width', '0%')
      }, 300)
    }

    /**
     * Close the modal, resume body scrolling
     * no param
     */
    self.close = function() {
      self.open = false
      self.dom.container.fadeOut()
      self.dom.body.removeClass('modal-active')
    }

    /**
     * Searchform submit event handler
     * @param queryText : (string) the query text
     */
    self.onSubmit = function(event) {
      event.preventDefault()
      self.queryText = $(this)
        .find('.u-search-input')
        .val()
      if (self.queryText) {
        self.search()
      }
    }

    /**
     * Perform a complete serach operation including UI updates and query
     */
    self.search = function() {
      self.beforeQuery()
      self.query(self.queryText, function() {
        self.afterQuery()
      })
    }

    self.googleSearch = function() {
      window.open(
        'https://www.google.com/search?hl=zh-CN&q=' +
          self.queryText +
          '&safe=off&lr=lang_zh-CN&cr=countryCN',
        '_blank'
      )
    }

    self.baiduSearch = function() {
      window.open('https://www.baidu.com/s?ie=UTF-8&wd=' + self.queryText, '_blank')
    }

    /**
     * Generate html for one result
     * @param url : (string) url
     * @param title : (string) title
     * @param digest : (string) digest
     */
    self.buildResult = function(url, title, digest) {
      var html = ''
      html = '<li>'
      html += "<a class='result' href='" + url + "'>"
      html += "<span class='title'>" + title + '</span>'
      // 搜索结果页面去掉内容
      // html +=     "<span class='digest'>" +digest+ "</span>";
      html += "<span class='fas fa-chevron-thin-right'></span>"
      html += '</a>'
      html += '</li>'
      return html
    }

    /**
     * Load template and register event handlers
     * no param
     */
    self.init = function() {
      $('body')
        .append(template)
        .keydown(function(e) {
          e = e || window.event
          if (e.keyCode == 27) {
            self.close()
          }
        })
      self.parseSelectors()
      self.dom.form.each(function(index, elem) {
        $(elem).on('submit', self.onSubmit)
      })
      self.dom.modal_overlay.on('click', self.close)
      self.dom.btn_close.on('click', self.close)
      self.dom.google_search.on('click', self.googleSearch)
      self.dom.baidu_search.on('click', self.baiduSearch)
    }

    self.init()
  }

  var template =
    '<div id="u-search"><div class="modal"> <header class="modal-header" class="clearfix"><form id="u-search-modal-form" class="u-search-form" name="uSearchModalForm"> <input type="text" id="u-search-modal-input" class="u-search-input" /> <button type="submit" id="u-search-modal-btn-submit" class="u-search-btn-submit"> <span class="fas fa-search"></span> </button></form> <a class="btn-close"> <span class="fas fa-times"></span> </a><div class="modal-loading"><div class="modal-loading-bar"></div></div> </header> <main class="modal-body"><ul class="modal-results"></ul> </main> <footer class="modal-footer clearfix"><div class="modal-other-search"><div class="google-search">使用 Google 搜索</div><div class="baidu-search">使用百度搜索</div></div></footer></div><div class="modal-overlay"></div></div>'
})(jQuery)
var HexoSearch
;(function($) {
  'use strict'

  /**
   * Search by Hexo generator json content
   * @param options : (object)
   */
  HexoSearch = function(options) {
    SearchService.apply(this, arguments)
    var self = this
    self.config.endpoint = ROOT + ((options || {}).endpoint || 'search.xml')
    self.config.endpoint = self.config.endpoint.replace('//', '/') //make sure the url is correct
    self.cache = ''

    /**
     * Search queryText in title and content of a post
     * Credit to: http://hahack.com/codes/local-search-engine-for-hexo/
     * @param post : the post object
     * @param queryText : the search query
     */
    self.contentSearch = function(post, queryText) {
      var post_title = post.title.trim().toLowerCase(),
        keywords = queryText
          .trim()
          .toLowerCase()
          .split(' '),
        foundMatch = false,
        index_title = -1
      if (post_title !== '') {
        $.each(keywords, function(index, word) {
          index_title = post_title.indexOf(word)
          if (index_title < 0) {
            foundMatch = false
          } else {
            foundMatch = true
          }
          if (foundMatch) {
            keywords.forEach(function(keyword) {
              var regS = new RegExp(keyword, 'gi')
              post.title = post.title.replace(regS, '<b>' + keyword + '</b>')
            })
          }
        })
      }
      return foundMatch
    }

    /**
     * Generate result list html
     * @param data : (array) result items
     */
    self.buildResultList = function(data, queryText) {
      var html = ''
      $.each(data, function(index, post) {
        if (self.contentSearch(post, queryText)) {
          html += self.buildResult(post.url, post.title, post.content)
        }
      })
      return html
    }

    /**
     * Send a GET request
     * @param queryText : (string) the query text
     * @param callback : (function)
     */
    self.query = function(queryText, callback) {
      if (!self.cache) {
        $.ajax({
          url: self.config.endpoint,
          dataType: 'xml',
          success: function(xmlResponse) {
            var dataList = $('entry', xmlResponse).map(function() {
              return {
                title: $('title', this).text(),
                // content: $('content', this).text(),
                url: $('url', this).text()
              }
            })
            self.cache = dataList
            handleData()
          }
        })
      } else {
        handleData()
      }
      function handleData() {
        var results = ''
        var noData = '<span class="no-data">暂无数据</span>'
        results += self.buildResultList(self.cache, queryText)
        self.dom.modal_results.html(results || noData)
        if (callback) {
          callback(self.cache)
        }
      }
    }

    return self
  }
})(jQuery)
