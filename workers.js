// 定义 KV 命名空间绑定
const BLOG_COMMENTS = "BLOG_COMMENTS";

// 站长标识（前端提交，评论区创建的特殊标识）
const ADMIN_SUBMIT_UUID = "b4334301-ec79-4176-a1ba-21b9611a3a4a";

// 站长真实标识（用于作为站长id存储）
const ADMIN_UUID = "deda5ce1-2e42-4cf9-bbae-0ce7f2cba55e";

// 加载动画 SVG（用于 JS 注入）
const LOADING_SVG = `<svg xml:space="preserve" viewBox="0 0 100 100" y="0px" x="0px" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" id="spinner" version="1.1" style="margin: initial; display: block; shape-rendering: auto;" preserveAspectRatio="xMidYMid" width="200" height="200">
<style>
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.1); opacity: 0.7; }
  }
  /* 为每个部分设置动画，并通过延迟使其依次跃动 */
  .pulse-part-1 { animation: pulse 1.5s ease-in-out infinite; animation-delay: 0s; }
  .pulse-part-2 { animation: pulse 1.5s ease-in-out infinite; animation-delay: 0.1s; }
  .pulse-part-3 { animation: pulse 1.5s ease-in-out infinite; animation-delay: 0.2s; }
  .pulse-part-4 { animation: pulse 1.5s ease-in-out infinite; animation-delay: 0.3s; }
  .pulse-part-5 { animation: pulse 1.5s ease-in-out infinite; animation-delay: 0.4s; }
  .pulse-part-6 { animation: pulse 1.5s ease-in-out infinite; animation-delay: 0.5s; }
  .pulse-part-7 { animation: pulse 1.5s ease-in-out infinite; animation-delay: 0.6s; }
</style>
<g class="ldl-scale" style="transform-origin: 50% 50%; transform: scale(0.8, 0.8);">
  <g class="ldl-ani">
    <g class="ldl-layer">
      <g class="ldl-ani pulse-part-1" style="transform-origin: 50px 50px; transform-box: view-box;">
        <!-- 橙色三角形 -->
        <path d="M29.6,75.1c-1.9,3.3-0.8,7.5,2.5,9.4s7.5,0.8,9.4-2.5l19.3-33.5l-12-6.9L29.6,75.1z" fill="#F47E60" style="stroke-width: 1; fill: rgb(244, 126, 96);"></path>
      </g>
    </g>
    <g class="ldl-layer">
      <g class="ldl-ani">
        <g>
          <g class="ldl-layer">
            <g class="ldl-ani pulse-part-2" style="transform-origin: 50px 50px; transform-box: view-box;">
              <!-- 主要轮廓 -->
              <path d="M29.5,89.1L29.5,89.1c-5.5-3.2-7.4-10.3-4.2-15.8L59.5,14l20,11.6L45.3,84.8C42.1,90.4,35,92.3,29.5,89.1z" stroke-miterlimit="10" stroke-width="3.5" stroke="#333333" fill="none" style="stroke-width: 3.5; stroke: rgb(51, 51, 51);"></path>
            </g>
          </g>
          <g class="ldl-layer">
            <g class="ldl-ani pulse-part-3" style="transform-origin: 50px 50px; transform-box: view-box;">
              <!-- 斜线 -->
              <line y2="28.7" x2="85" y1="10.8" x1="54" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round" stroke-width="3.5" stroke="#333333" fill="none" style="stroke-width: 3.5; stroke: rgb(51, 51, 51);"></line>
            </g>
          </g>
          <g class="ldl-layer">
            <g class="ldl-ani pulse-part-4" style="transform-origin: 50px 50px; transform-box: view-box;">
              <line y2="51" x2="51.5" y1="56.8" x1="61.5" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round" stroke-width="3.5" stroke="#333333" fill="none" style="stroke-width: 3.5; stroke: rgb(51, 51, 51);"></line>
            </g>
          </g>
          <g class="ldl-layer">
            <g class="ldl-ani pulse-part-5" style="transform-origin: 50px 50px; transform-box: view-box;">
              <line y2="62.2" x2="50.8" y1="65.5" x1="56.5" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round" stroke-width="3.5" stroke="#333333" fill="none" style="stroke-width: 3.5; stroke: rgb(51, 51, 51);"></line>
            </g>
          </g>
          <g class="ldl-layer">
            <g class="ldl-ani pulse-part-6" style="transform-origin: 50px 50px; transform-box: view-box;">
              <line y2="70.8" x2="45.8" y1="74.1" x1="51.5" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round" stroke-width="3.5" stroke="#333333" fill="none" style="stroke-width: 3.5; stroke: rgb(51, 51, 51);"></line>
            </g>
          </g>
          <g class="ldl-layer">
            <g class="ldl-ani pulse-part-7" style="transform-origin: 50px 50px; transform-box: view-box;">
              <line y2="79.5" x2="40.8" y1="82.8" x1="46.5" stroke-miterlimit="10" stroke-linejoin="round" stroke-linecap="round" stroke-width="3.5" stroke="#333333" fill="none" style="stroke-width: 3.5; stroke: rgb(51, 51, 51);"></line>
            </g>
          </g>
        </g>
      </g>
    </g>
  </g>
</g>
</svg>
`;

// 发送 Telegram 通知（仅服务端用）
async function sendTelegramNotification(env, comment, articleUrl) {
    if (!env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) {
        console.warn('Telegram 通知未配置，跳过发送');
        return;
    }

    const message = `
新评论通知

评论内容: ${comment.content}
昵称: ${comment.author} ${comment.isAdmin ? '(站长)' : ''}
网站: ${comment.website || '未提供'}
文章: ${articleUrl}
时间: ${new Date(comment.timestamp).toLocaleString()} （UTC）

访问信息：
IP: ${comment.userInfo.ip}
UA: ${comment.userInfo.userAgent}
    `.trim();

    try {
        const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: env.TELEGRAM_CHAT_ID,
                text: message,
                disable_web_page_preview: true,
            }),
        });

        if (!response.ok) {
            console.error('Telegram 通知发送失败:', await response.text());
        }
    } catch (error) {
        console.error('Telegram 通知发送错误:', error);
    }
}

// 生成随机ID
function generateId() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 验证 hCaptcha
async function verifyCaptcha(token, secret) {
    const formData = new FormData();
    formData.append('response', token);
    formData.append('secret', secret);
    const response = await fetch('https://hcaptcha.com/siteverify', { method: 'POST', body: formData });
    return await response.json();
}

// 获取用户信息
function getUserInfo(request) {
    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    return { ip, userAgent };
}

function getMainJsContent(hcaptchaSiteKey) {
    return `(function() {
        const SCRIPT_URL = 'https://comments.itman-terminal.workers.dev'; // 移除末尾空格
        const HCAPTCHA_SITEKEY = '${hcaptchaSiteKey}';
        const LOADING_SVG = \`${LOADING_SVG.trim()}\`; // 如果 LOADING_SVG 是空字符串，这里会是空

        // 从当前 script 标签中提取参数
        let currentScript = document.currentScript;
        if (!currentScript) {
            const scripts = document.getElementsByTagName('script');
            currentScript = scripts[scripts.length - 1];
        }
        const src = currentScript.src;
        const urlParams = new URLSearchParams(new URL(src).search);
        const article = urlParams.get('article') || '';
        const onloadCallback = urlParams.get('onload');

        if (!article) {
            console.error('缺少 article 参数');
            return;
        }

        // 创建容器
        const container = document.createElement('div');
        container.id = 'itman-comments-root';
        // 移除 container.className = 'container my-4'; // 移除 Bootstrap 类
        currentScript.parentNode.insertBefore(container, currentScript.nextSibling);

        // Cookie 工具 (保持不变)
        function setCookie(name, value, days = 365) {
            const d = new Date();
            d.setTime(d.getTime() + days * 864e5);
            document.cookie = name + "=" + encodeURIComponent(value) + ";expires=" + d.toUTCString() + ";path=/;SameSite=Lax";
        }

        function getCookie(name) {
            return document.cookie.split('; ').find(row => row.startsWith(name + '='))?.split('=')[1] || null;
        }

        function deleteCookie(name) {
            document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        }

        // 安全转义 (保持不变)
        function escapeHtml(str) {
            const div = document.createElement('div');
            div.textContent = str;
            return div.innerHTML;
        }

        function escapeUrl(url) {
            if (!url) return '';
            if (!/^https?:\\/\\//i.test(url)) url = 'https://' + url;
            return encodeURI(url);
        }

        // 消息显示 (移除 Bootstrap alert 类，使用通用样式)
        function showMsg(el, msg, type) {
            if (!el) {
                 console.warn('showMsg: 消息容器元素不存在');
                 return;
            }
            const alertClass = type === 'error' ? 'itman-alert-danger' : 'itman-alert-success';
            // 移除 fade show 类，简化结构
            el.innerHTML = \`
                <div class="itman-alert \${alertClass}" style="padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid; \${type === 'error' ? 'background-color: #f8d7da; border-color: #f5c6cb; color: #721c24;' : 'background-color: #d4edda; border-color: #c3e6cb; color: #155724;'}">
                    \${escapeHtml(msg)}
                    <button type="button" class="itman-close-btn" style="float: right; background: none; border: none; font-size: 1.2em; cursor: pointer;" onclick="this.parentElement.remove();">&times;</button>
                </div>
            \`;
        }

        // 清除消息 (保持不变)
        function clearMsg(el) {
            if (el) el.innerHTML = '';
        }

        // 渲染表单
        function renderForm() {
            const formHtml = \`
                <div class="itman-comment-section" style="max-width: 100%; margin: 1.5em 0; padding: 1.5em; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                    <h3 style="margin-top: 0; color: #333;">
                        <i class="fas fa-comments" style="margin-right: 0.5em;"></i>发表评论
                    </h3>

                    <div id="itman-form-messages"></div>

                    <div id="itman-reply-indicator" class="itman-reply-indicator" style="display: none; padding: 10px; margin: 10px 0; background-color: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span>正在回复 <strong id="itman-reply-author"></strong></span>
                            <button type="button" class="itman-close-btn" style="background: none; border: none; font-size: 1.2em; cursor: pointer;" id="itman-cancel-reply">&times;</button>
                        </div>
                    </div>

                    <form id="itman-comment-form">
                        <div style="margin-bottom: 1rem;">
                            <label for="itman-content" class="itman-form-label" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">评论内容 <span style="color: #666; font-weight: normal;">(不超过250字)</span></label>
                            <textarea
                                class="itman-form-control"
                                id="itman-content"
                                name="content"
                                rows="4"
                                maxlength="250"
                                placeholder="请输入您的评论内容..."
                                required
                                style="width: 100%; padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; resize: vertical; box-sizing: border-box;"
                            ></textarea>
                            <div style="font-size: 0.875em; color: #6c757d; margin-top: 0.25rem;">
                                <span id="itman-char-count">0</span>/250 字
                            </div>
                        </div>

                        <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 1rem;">
                            <div style="flex: 1; min-width: 200px;">
                                <label for="itman-author" class="itman-form-label" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">昵称</label>
                                <input
                                    type="text"
                                    class="itman-form-control"
                                    id="itman-author"
                                    name="author"
                                    placeholder="请输入您的昵称"
                                    required
                                    style="width: 100%; padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"
                                >
                            </div>
                            <div style="flex: 1; min-width: 200px;">
                                <label for="itman-website" class="itman-form-label" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">个人网站或联系方式</label>
                                <input
                                    type="text"
                                    class="itman-form-control"
                                    id="itman-website"
                                    name="website"
                                    placeholder="选填，例如：example.com"
                                    style="width: 100%; padding: 8px 12px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;"
                                >
                            </div>
                        </div>

                        <div style="margin-bottom: 1rem;">
                            <label class="itman-form-label" style="display: block; margin-bottom: 0.5rem; font-weight: bold;">人机验证</label>
                            <div style="display: flex; justify-content: center; align-items: center; padding: 1rem; background-color: #f0f0f0; border-radius: 4px;">
                                <div id="itman-hcaptcha-loading" style="display: block;">
                                    \${LOADING_SVG || '<p>加载中...</p>'} <!-- 如果 LOADING_SVG 为空，则显示文字 -->
                                </div>
                                <div id="itman-hcaptcha-widget" style="display: none;"></div> <!-- 初始隐藏，加载后显示 -->
                            </div>
                        </div>

                        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                            <button type="submit" class="itman-submit-btn" style="padding: 0.5rem 1rem; background-color: #007bff; color: white; border: 1px solid #007bff; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-paper-plane" style="margin-right: 0.5em;"></i>提交评论
                            </button>
                            <button type="button" class="itman-reset-btn" style="padding: 0.5rem 1rem; background-color: #6c757d; color: white; border: 1px solid #6c757d; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-redo" style="margin-right: 0.5em;"></i>重置验证
                            </button>
                            <button type="button" class="itman-clear-btn" style="padding: 0.5rem 1rem; background-color: #ffc107; color: #212529; border: 1px solid #ffc107; border-radius: 4px; cursor: pointer;">
                                <i class="fas fa-trash" style="margin-right: 0.5em;"></i>清除信息
                            </button>
                        </div>
                    </form>
                </div>
            \`;

            const commentsHtml = \`
                <div class="itman-comments-section" style="max-width: 100%; margin: 1.5em 0; padding: 1.5em; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
                    <h3 style="margin-top: 0; color: #333;">
                        <i class="fas fa-list" style="margin-right: 0.5em;"></i>评论列表
                    </h3>
                    <div id="itman-comments-container"></div>
                </div>
            \`;

            container.innerHTML = formHtml + commentsHtml;

            // 字符计数 (保持不变)
            const contentTextarea = document.getElementById('itman-content');
            const charCount = document.getElementById('itman-char-count');
            if (contentTextarea && charCount) {
                contentTextarea.addEventListener('input', function() {
                    charCount.textContent = this.value.length;
                });
            }

            // 加载 hCaptcha
            loadHcaptcha();
        }

        // 加载 hCaptcha (移除对 Bootstrap 的依赖)
        function loadHcaptcha() {
            if (!window.hcaptcha) {
                const script = document.createElement('script');
                script.src = 'https://js.hcaptcha.com/1/api.js?onload=itmanHcaptchaOnLoad&render=explicit';
                script.async = true;
                script.defer = true;
                document.head.appendChild(script);
            } else if (window.hcaptchaOnLoad) {
                window.itmanHcaptchaOnLoad();
            }
        }

        // hCaptcha 回调 (调整显示逻辑)
        window.itmanHcaptchaOnLoad = function() {
            const widget = document.getElementById('itman-hcaptcha-widget');
            const loadingDiv = document.getElementById('itman-hcaptcha-loading');
            if (widget && loadingDiv) {
                // 隐藏加载指示器，显示 hCaptcha 容器
                loadingDiv.style.display = 'none';
                widget.style.display = 'block';
                window.hcaptchaWidgetId = hcaptcha.render(widget.id, {
                    sitekey: HCAPTCHA_SITEKEY,
                    theme: 'light'
                });
            }
        };

        // 全局状态 (保持不变)
        let replyingTo = null;

        // 加载评论 (移除对 Bootstrap 的依赖，并修复隐藏表单的错误)
        async function loadComments() {
            const el = document.getElementById('itman-comments-container');
            if (!el) {
                 console.error('loadComments: 评论容器元素 #itman-comments-container 不存在');
                 return;
            }
            el.innerHTML = \`
                <div style="display: flex; justify-content: center; align-items: center; padding: 2rem; text-align: center;">
                    \${LOADING_SVG || '<p>加载评论中...</p>'} <!-- 如果 LOADING_SVG 为空，则显示文字 -->
                </div>
            \`;

            try {
                const res = await fetch(\`\${SCRIPT_URL}/api/list?article=\${encodeURIComponent(article)}\`);
                if (res.status === 404) {
                    el.innerHTML = \`
                        <div style="text-align: center; padding: 2rem; color: #666;">
                            <i class="fas fa-comments fa-3x" style="margin-bottom: 1rem;"></i>
                            <h5>本文暂无评论区</h5>
                            <p>请站长先创建评论区</p>
                        </div>
                    \`;
                    // 修复：检查元素是否存在再操作
                    const formElement = document.querySelector('#itman-comment-form');
                    if (formElement) {
                        formElement.style.display = 'none';
                    } else {
                        console.warn('警告: 未找到评论表单元素 #itman-comment-form，无法隐藏。');
                    }
                    return;
                }

                const data = await res.json();
                if (res.ok) {
                    renderComments(data.comments, el);
                } else {
                    el.innerHTML = \`
                        <div class="itman-alert itman-alert-danger" style="padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid #f5c6cb; background-color: #f8d7da; color: #721c24;">
                            <i class="fas fa-exclamation-triangle" style="margin-right: 0.5em;"></i>
                            \${data.error || '加载评论失败'}
                        </div>
                    \`;
                }
            } catch (e) {
                el.innerHTML = \`
                    <div class="itman-alert itman-alert-danger" style="padding: 10px; margin: 10px 0; border-radius: 4px; border: 1px solid #f5c6cb; background-color: #f8d7da; color: #721c24;">
                        <i class="fas fa-exclamation-triangle" style="margin-right: 0.5em;"></i>
                        网络错误: \${e.message}
                    </div>
                \`;
            }
        }

        // 渲染评论列表 (移除对 Bootstrap 的依赖)
        function renderComments(comments, container) {
            if (!container) {
                 console.error('renderComments: 评论容器不存在');
                 return;
            }
            if (!comments || comments.length === 0) {
                container.innerHTML = \`
                    <div style="text-align: center; padding: 2rem; color: #666;">
                        <i class="fas fa-comment-slash fa-3x" style="margin-bottom: 1rem;"></i>
                        <h5>暂无评论</h5>
                        <p>快来抢沙发吧~</p>
                    </div>
                \`;
                return;
            }

            // 构建评论树 (保持不变)
            const map = {};
            const roots = [];
            comments.forEach(c => map[c.id] = {...c, replies: []});
            comments.forEach(c => {
                if (c.parentId && map[c.parentId]) {
                    map[c.parentId].replies.push(map[c.id]);
                } else {
                    roots.push(map[c.id]);
                }
            });

            // 渲染评论树
            container.innerHTML = roots.map(comment => renderCommentTree(comment)).join('');

            // 绑定事件 (保持不变)
            bindCommentEvents();
        }

        // 渲染单个评论
        function renderCommentTree(comment, depth = 0) {
            const isAdmin = comment.isAdmin;
            const date = new Date(comment.timestamp).toLocaleString('zh-CN');
            const authorDisplay = escapeHtml(comment.author);
            // 为嵌套回复添加缩进样式
            const marginLeft = depth > 0 ? 'style="margin-left: 2rem;"' : '';

            return \`
                <div class="itman-comment" \${marginLeft}>
                    <div style="padding: 1rem; border-bottom: 1px solid #eee; \${isAdmin ? 'background-color: #f0f8ff;' : ''}">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
                            <div style="display: flex; align-items: center;">
                                <strong style="margin-right: 0.5rem;">\${authorDisplay}</strong>
                                \${isAdmin ? '<span style="background-color: #28a745; color: white; padding: 0.1rem 0.4rem; border-radius: 0.25rem; font-size: 0.8em;">站长</span>' : ''}
                            </div>
                            <small style="color: #666;">\${date}</small>
                        </div>

                        \${comment.website ? \`
                            <div style="margin-bottom: 0.5rem;">
                                <small style="color: #666;">
                                    <a href="\${escapeUrl(comment.website)}" target="_blank" rel="noopener noreferrer" style="color: #007bff; text-decoration: none;">
                                        <i class="fas fa-link" style="margin-right: 0.25em;"></i>\${escapeHtml(comment.website)}
                                    </a>
                                </small>
                            </div>
                        \` : ''}

                        <div style="margin-bottom: 0.75rem;">\${escapeHtml(comment.content)}</div>

                        <div style="display: flex; gap: 1rem;">
                            <button class="itman-like-btn" data-id="\${comment.id}" style="padding: 0.25rem 0.5rem; background-color: #e9ecef; color: #495057; border: 1px solid #ced4da; border-radius: 0.25rem; cursor: pointer; display: flex; align-items: center;">
                                <i class="fas fa-thumbs-up" style="margin-right: 0.25em;"></i>
                                <span class="itman-like-count">\${comment.likes || 0}</span>
                            </button>
                            <button class="itman-reply-btn" data-id="\${comment.id}" style="padding: 0.25rem 0.5rem; background-color: #e9ecef; color: #495057; border: 1px solid #ced4da; border-radius: 0.25rem; cursor: pointer; display: flex; align-items: center;">
                                <i class="fas fa-reply" style="margin-right: 0.25em;"></i>回复
                            </button>
                        </div>
                    </div>

                    \${comment.replies && comment.replies.length > 0 ? \`
                        <div class="itman-replies">
                            \${comment.replies.map(reply => renderCommentTree(reply, depth + 1)).join('')}
                        </div>
                    \` : ''}
                </div>
            \`;
        }

        // 绑定评论事件 (保持不变)
        function bindCommentEvents() {
            // 点赞事件
            document.querySelectorAll('.itman-like-btn').forEach(btn => {
                btn.addEventListener('click', handleLike);
            });

            // 回复事件
            document.querySelectorAll('.itman-reply-btn').forEach(btn => {
                btn.addEventListener('click', handleReply);
            });
        }

        // 处理点赞 (保持不变)
        async function handleLike(e) {
            const id = e.currentTarget.dataset.id;
            const btn = e.currentTarget;
            if (!btn) {
                 console.error('handleLike: 点赞按钮不存在');
                 return;
            }
            const originalHTML = btn.innerHTML;

            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5em;"></i>点赞中...';

            try {
                const res = await fetch(\`\${SCRIPT_URL}/api/agree\`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({commentId: id})
                });

                const data = await res.json();
                if (res.ok) {
                    const countEl = btn.querySelector('.itman-like-count');
                    if (countEl) {
                        countEl.textContent = data.newCount;
                        // 简单改变样式表示已点赞
                        btn.style.backgroundColor = '#007bff';
                        btn.style.color = 'white';
                        btn.style.borderColor = '#007bff';
                    }
                } else {
                    showMsg(document.getElementById('itman-form-messages'), data.error || '点赞失败', 'error');
                }
            } catch (err) {
                showMsg(document.getElementById('itman-form-messages'), '网络错误，点赞失败', 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        }

        // 处理回复 (保持不变)
        function handleReply(e) {
            const commentId = e.currentTarget.dataset.id;
            const commentEl = e.currentTarget.closest('.itman-comment > div'); // 调整选择器
            if (!commentEl) {
                 console.error('handleReply: 无法找到评论元素');
                 return;
            }
            const authorEl = commentEl.querySelector('strong');
            const authorName = authorEl ? authorEl.textContent : '';

            replyingTo = commentId;

            // 显示回复指示器
            const indicator = document.getElementById('itman-reply-indicator');
            const replyAuthor = document.getElementById('itman-reply-author');
            if (indicator && replyAuthor) {
                indicator.style.display = 'block'; // 改为 block
                replyAuthor.textContent = authorName;
            } else {
                console.warn('handleReply: 回复指示器或作者元素不存在');
            }


            // 聚焦到评论框
            const content = document.getElementById('itman-content');
            if (content) {
                content.value = \`回复 \${authorName}: \`;
                content.focus();
            } else {
                 console.error('handleReply: 评论内容输入框 #itman-content 不存在');
                 return;
            }


            // 滚动到表单
            const formElement = document.getElementById('itman-comment-form');
            if (formElement) {
                formElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            } else {
                 console.error('handleReply: 评论表单 #itman-comment-form 不存在');
                 return;
            }
        }

        // 取消回复 (保持不变)
        function cancelReply() {
            replyingTo = null;
            const indicator = document.getElementById('itman-reply-indicator');
            if (indicator) {
                indicator.style.display = 'none'; // 改为 none
            }
            const content = document.getElementById('itman-content');
            if (content) {
                content.value = '';
            }
        }

        // 表单提交 (保持不变)
        async function handleSubmit(e) {
            e.preventDefault();
            const form = e.target;
            if (!form) {
                 console.error('handleSubmit: 表单元素不存在');
                 return;
            }
            const content = form.content.value.trim();
            const author = form.author.value.trim();
            const website = form.website.value.trim();
            const captcha = window.hcaptcha ? hcaptcha.getResponse(window.hcaptchaWidgetId) : '';

            const msgEl = document.getElementById('itman-form-messages');
            clearMsg(msgEl);

            // 验证 (保持不变)
            if (!content) {
                showMsg(msgEl, '请输入评论内容', 'error');
                return;
            }
            if (content.length > 250) {
                showMsg(msgEl, '评论不能超过250字', 'error');
                return;
            }
            if (!author) {
                showMsg(msgEl, '请输入昵称', 'error');
                return;
            }
            if (!captcha) {
                showMsg(msgEl, '请完成人机验证', 'error');
                return;
            }

            const btn = form.querySelector('button[type="submit"]');
            if (!btn) {
                 console.error('handleSubmit: 提交按钮不存在');
                 return;
            }
            const originalHTML = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right: 0.5em;"></i>提交中...';

            try {
                const res = await fetch(\`\${SCRIPT_URL}/api/submit\`, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({
                        article,
                        content,
                        author,
                        website,
                        hcaptchaResponse: captcha,
                        parentId: replyingTo
                    })
                });

                if (res.status === 404) {
                    showMsg(msgEl, '评论区不存在', 'error');
                    return;
                }

                const data = await res.json();
                if (res.ok) {
                    // 重置表单
                    form.reset();
                    const charCount = document.getElementById('itman-char-count');
                    if (charCount) {
                        charCount.textContent = '0';
                    }
                    if (window.hcaptcha && window.hcaptchaWidgetId) {
                        hcaptcha.reset(window.hcaptchaWidgetId);
                    }

                    // 取消回复状态
                    cancelReply();

                    // 显示成功消息
                    showMsg(msgEl, '评论提交成功！', 'success');

                    // 重新加载评论
                    setTimeout(loadComments, 1000);
                } else {
                    showMsg(msgEl, data.error || '提交失败', 'error');
                }
            } catch (err) {
                showMsg(msgEl, '网络错误: ' + err.message, 'error');
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalHTML;
            }
        }

        // 初始化 (移除加载 Bootstrap CSS 的函数调用，并修复获取元素可能为空的错误)
        function init() {
            // 渲染界面
            renderForm(); // 这行会将表单HTML插入DOM

            // --- 修复点：在绑定事件前检查表单元素是否存在 ---
            const formElement = document.getElementById('itman-comment-form');
            if (!formElement) {
                console.error('错误: 无法找到评论表单元素 #itman-comment-form，评论功能将无法使用。');
                return; // 如果表单不存在，停止初始化
            }

            // 绑定事件 (现在可以安全地访问 formElement)
            formElement.addEventListener('submit', handleSubmit);

            // ... 其他事件绑定也需要检查相关元素是否存在 ...
            // 例如，检查取消回复按钮
            const cancelReplyBtn = document.getElementById('itman-cancel-reply');
            if (cancelReplyBtn) {
                cancelReplyBtn.addEventListener('click', cancelReply);
            } else {
                console.warn('警告: 未找到取消回复按钮 #itman-cancel-reply');
            }

            // 检查重置验证码按钮
            const resetCaptchaBtn = document.getElementById('itman-reset-captcha');
            if (resetCaptchaBtn) {
                resetCaptchaBtn.addEventListener('click', () => {
                    if (window.hcaptcha && window.hcaptchaWidgetId) {
                        hcaptcha.reset(window.hcaptchaWidgetId);
                    }
                });
            } else {
                console.warn('警告: 未找到重置验证码按钮 #itman-reset-captcha');
            }

            // 检查清除数据按钮
            const clearDataBtn = document.getElementById('itman-clear-data');
            if (clearDataBtn) {
                clearDataBtn.addEventListener('click', () => {
                    deleteCookie('itman_author');
                    deleteCookie('itman_website');
                    const authorInput = document.getElementById('itman-author');
                    const websiteInput = document.getElementById('itman-website');
                    if (authorInput) authorInput.value = '';
                    if (websiteInput) websiteInput.value = '';
                    showMsg(document.getElementById('itman-form-messages'), '已清除保存的信息', 'success');
                });
            } else {
                console.warn('警告: 未找到清除数据按钮 #itman-clear-data');
            }

            // ... (继续检查其他可能需要的元素，如 itman-author, itman-website, itman-char-count 等) ...

            // 自动填充保存的信息 (检查相关元素)
            const savedAuthor = getCookie('itman_author');
            const savedWebsite = getCookie('itman_website');
            const authorInput = document.getElementById('itman-author');
            const websiteInput = document.getElementById('itman-website');
            if (authorInput && savedAuthor) authorInput.value = savedAuthor;
            if (websiteInput && savedWebsite) websiteInput.value = savedWebsite;

            // 自动保存输入（防抖） (检查相关元素)
            let saveTimer;
            const saveDebounce = (fn) => {
                clearTimeout(saveTimer);
                saveTimer = setTimeout(fn, 1000);
            };

            if (authorInput) {
                authorInput.addEventListener('input', () => {
                    saveDebounce(() => {
                        const value = authorInput.value;
                        if (value) setCookie('itman_author', value);
                    });
                });
            }

            if (websiteInput) {
                websiteInput.addEventListener('input', () => {
                    saveDebounce(() => {
                        const value = websiteInput.value;
                        if (value) setCookie('itman_website', value);
                    });
                });
            }

            // 加载评论 (保持不变)
            loadComments();

            // 执行回调函数 (保持不变)
            if (onloadCallback && typeof window[onloadCallback] === 'function') {
                window[onloadCallback]();
            }
        }

        // 启动 (保持不变)
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
    `;
}
// 主入口
export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;
        const userInfo = getUserInfo(request);

        // 1. 返回 main.js（允许任意来源加载 JS）
        if (path === '/main.js') {
            const hcaptchaSiteKey = env.HCAPTCHA_SITEKEY || '';
            const jsContent = getMainJsContent(hcaptchaSiteKey);
            return new Response(jsContent, {
                headers: {
                    'Content-Type': 'application/javascript; charset=utf-8',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Cache-Control': 'public, max-age=3600'
                }
            });
        }

        // 2. 处理 API 请求（关键：设置 CORS）
        if (path.startsWith('/api')) {
            // === CORS 配置 ===
            // 请根据你的实际博客域名修改！
            const allowedOrigin = '*';
            const corsHeaders = {
                'Access-Control-Allow-Origin': allowedOrigin,
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Content-Type': 'application/json'
            };

            // 处理预检请求（OPTIONS）
            if (request.method === 'OPTIONS') {
                return new Response(null, { headers: corsHeaders });
            }

            // 实际 API 逻辑
            if (path === '/api/list' && request.method === 'GET') {
                const article = url.searchParams.get('article') || '';
                const comments = await env.BLOG_COMMENTS.get(article, { type: 'json' });
                if (comments === null) {
                    return new Response(JSON.stringify({ error: '本文评论区不存在' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                }
                const processedComments = comments.map(comment => ({
                    ...comment,
                    isAdmin: comment.authorId === ADMIN_UUID
                }));
                return new Response(JSON.stringify({ comments: processedComments }), {
                    headers: corsHeaders
                });
            }
            else if (path.startsWith('/api/new/') && request.method === 'GET') {
                const parts = path.split('/');
                const adminUuid = parts[3];
                const article = parts.slice(4).join('/');
                if (adminUuid !== ADMIN_SUBMIT_UUID) {
                    return new Response(JSON.stringify({ error: '无权操作' }), {
                        status: 403,
                        headers: corsHeaders
                    });
                }
                const existing = await env.BLOG_COMMENTS.get(article);
                if (existing !== null) {
                    return new Response(JSON.stringify({ error: '评论区已存在' }), {
                        status: 400,
                        headers: corsHeaders
                    });
                }
                await env.BLOG_COMMENTS.put(article, JSON.stringify([]));
                return new Response(JSON.stringify({ success: true }), {
                    headers: corsHeaders
                });
            }
            else if (path === '/api/submit' && request.method === 'POST') {
                try {
                    const data = await request.json();
                    const { article, content, author, website, hcaptchaResponse, parentId } = data;
                    const verification = await verifyCaptcha(hcaptchaResponse, env.HCAPTCHA_SECRET);
                    if (!verification.success) {
                        return new Response(JSON.stringify({ error: '人机验证失败' }), {
                            status: 400,
                            headers: corsHeaders
                        });
                    }
                    if (!content || content.length > 250 || !author) {
                        return new Response(JSON.stringify({ error: '无效的输入' }), {
                            status: 400,
                            headers: corsHeaders
                        });
                    }
                    const comments = await env.BLOG_COMMENTS.get(article, { type: 'json' });
                    if (comments === null) {
                        return new Response(JSON.stringify({ error: '本文评论区不存在' }), {
                            status: 404,
                            headers: corsHeaders
                        });
                    }
                    const isAdminSubmission = author === ADMIN_SUBMIT_UUID;
                    const finalAuthor = isAdminSubmission ? "站长" : author;
                    const authorId = isAdminSubmission ? ADMIN_UUID : generateId();
                    const newComment = {
                        id: generateId(),
                        parentId: parentId || null,
                        content,
                        author: finalAuthor,
                        authorId,
                        website: website || null,
                        timestamp: Date.now(),
                        likes: 0,
                        isAdmin: isAdminSubmission,
                        userInfo
                    };
                    comments.push(newComment);
                    await env.BLOG_COMMENTS.put(article, JSON.stringify(comments));
                    const articleUrl = `https://itman-terminal.pages.dev/posts/${encodeURIComponent(article)}`;
                    await sendTelegramNotification(env, newComment, articleUrl);
                    return new Response(JSON.stringify({ success: true }), {
                        headers: corsHeaders
                    });
                } catch (error) {
                    return new Response(JSON.stringify({ error: '服务器错误' }), {
                        status: 500,
                        headers: corsHeaders
                    });
                }
            }
            else if (path === '/api/agree' && request.method === 'POST') {
                try {
                    const { commentId } = await request.json();
                    if (!commentId) {
                        return new Response(JSON.stringify({ error: '缺少评论ID' }), {
                            status: 400,
                            headers: corsHeaders
                        });
                    }
                    const keys = await env.BLOG_COMMENTS.list();
                    for (const key of keys.keys) {
                        const comments = await env.BLOG_COMMENTS.get(key.name, { type: 'json' });
                        if (!comments) continue;
                        const idx = comments.findIndex(c => c.id === commentId);
                        if (idx !== -1) {
                            comments[idx].likes = (comments[idx].likes || 0) + 1;
                            await env.BLOG_COMMENTS.put(key.name, JSON.stringify(comments));
                            return new Response(JSON.stringify({ success: true, newCount: comments[idx].likes }), {
                                headers: corsHeaders
                            });
                        }
                    }
                    return new Response(JSON.stringify({ error: '评论未找到' }), {
                        status: 404,
                        headers: corsHeaders
                    });
                } catch (error) {
                    return new Response(JSON.stringify({ error: '服务器错误' }), {
                        status: 500,
                        headers: corsHeaders
                    });
                }
            }
            // 未知 API
            return new Response(JSON.stringify({ error: 'API 未找到' }), {
                status: 404,
                headers: corsHeaders
            });
        }

        // 3. 其他路径返回 404
        return new Response('Not Found', { status: 404 });
    }
};