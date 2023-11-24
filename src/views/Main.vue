<script setup>


</script>

<template>
  <div class="main-container">
    <div class="main-banner">
      <div class="main-banner-title">
        <h1>Qualic 剧本编辑器</h1>
      </div>
      <div class="main-banner-subtitle">
        <p>你知道你要做什么</p>
      </div>
    </div>
    <div class="content-container">
      <h2>关于 Qualic</h2>
      <p>Qualic 是一个剧本编辑器。它可以快速的帮你进行剧本写作，而无需进行排版。</p>
      <p>请注意，Qualic 的建议补全功能由 GPT 驱动。在开始之前需要设置。</p>
      <p>Qualic 只会在本地暂时存储数据，无任何上传功能。</p>
      <p>作为 Qua 项目的一部分，Qualic 旨在减轻剧本写作的负担。</p>
      <h2>开始使用</h2>
      <p>在左侧的菜单中选择你想要的编辑器。</p>
      <p>Visual 编辑器可以帮助你快速的进行剧本写作，而 Text 编辑器可以帮助你进行更加精细的编辑。</p>
      <h2>注意事项</h2>
      <p>Qualic 仍然处于开发阶段，可能会有一些 Bug。</p>
      <p>Characters 的输入请按照换行隔开，不是不想实现优雅一点而是想要快点操作</p>
      <p>Visual Editor 只显示上一百行对话，要编辑请到 Text Editor</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.main-container {
  width: 100%;
  .main-banner {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background: linear-gradient(112deg, var(--primary-80), var(--primary-70) 50%, var(--secondary-70) 90%);
    // make a lower triangle
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 5vw));
    padding: 4rem 2rem 7rem;
    margin-bottom: -4rem;
    // make a margin for the banner
    .main-banner-title {
      h1 {
        font-size: 3rem;
        font-weight: 700;
        margin: 0;
      }
    }
  }

  .content-container {
    // make the content center
    margin: 0 auto;
    max-width: 800px;
    padding: 2rem;
    p {
      margin-bottom: 0.8rem;
    }
  }
}
</style>