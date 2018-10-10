<template>
  <el-container id="app">
    <el-aside>
      <el-input
        v-model="filterText"
        placeholder="Search" />
      <el-tree
        v-if="specs.length"
        ref="tree"
        :data="treeData"
        :props="defaultProps"
        :empty-text="'(╯°□°）╯︵ ┻━┻'"
        :filter-node-method="filterNode"
        @node-click="selectNode" />
    </el-aside>
    <el-main>
      <el-cascader
        :options="specs"
        :change-on-select="true"
        v-model="selectedOptions"
        filterable
        separator=" "
        placeholder="Select a folder"
        @keyup.delete.native="clearOptions"/>
      <hr class="line">

      <template v-if="filteredFolders.length">
        <div class="title">Folders</div>
        <div class="grid">
          <el-card
            v-for="(o, i) in filteredFolders"
            :key="i"
            :title="o.label"
            shadow="hover"
            class="grid-item folder-card"
            @click.native="selectFolder(o)">
            <font-awesome-icon
              :style="{ color: colors[i % currentFolder.length] }"
              icon="folder"
              class="folder-icon" />
            {{ o.label }}
          </el-card>
        </div>
      </template>

      <template v-if="filteredSpecs.length">
        <div class="title">Specs</div>
        <div class="grid">
          <a
            v-for="(spec, i) in filteredSpecs"
            :key="i"
            :href="spec.href"
            target="_blank"
            rel="noopener">
            <el-card
              :body-style="{ padding: 0 }"
              shadow="hover"
              class="grid-item spec-card">
              <div class="spec-image">
                <img
                  :key="spec.preview"
                  :src="spec.preview"
                  onerror="this.src='http:///i.imgur.com/hfM1J8s.png'">
              </div>
              <div class="spec-bottom">
                <div>{{ spec.label }}</div>
                <div>
                  <time class="time">{{ new Date(spec.mtime).toLocaleString() }}</time>
                  <el-tag size="mini">
                    v{{ spec.version }}
                  </el-tag>
                </div>
              </div>
            </el-card>
          </a>
        </div>
      </template>
    </el-main>
  </el-container>
</template>

<script>
import { mapState } from 'vuex'
import fuzzysearch from 'fuzzysearch'
import find from 'lodash/find'
import orderBy from 'lodash/orderBy'

const colors = [
  '#409eff',
  '#67c23a',
  '#e6a23c',
  '#f56c6c',
  '#909399',
  '#73B8FF',
  '#8EC275',
  '#E6C18A'
]

function order(folder) {
  folder.forEach(item => {
    if (item.children) item.children = order(item.children)
  })
  return orderBy(folder, ['mtime'], ['desc'])
}

export default {
  name: 'app',
  data() {
    return {
      colors,
      filterText: '',
      selectedOptions: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  computed: {
    ...mapState(['specs']),
    sortedSpecs() {
      if (!this.specs.length) return []
      return order(this.specs, ['mtime'], ['desc'])
    },
    treeData() {
      return this.sortedSpecs[0].children
    },
    currentFolder() {
      return this.selectedOptions.reduce((specs, path) => {
        const r = find(specs, ['value', path])
        return r.children || [r]
      }, this.sortedSpecs)
    },
    filteredFolders() {
      return this.currentFolder.filter(f => !f.isSpec)
    },
    filteredSpecs() {
      return this.currentFolder.filter(f => f.isSpec)
    }
  },
  watch: {
    selectedOptions: 'updateHash',
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    specs() {
      const hash = window.location.hash.replace('#', '')
      this.selectedOptions = hash === '' ? ['all'] : decodeURI(hash).split('/')
    }
  },
  async created() {
    await this.$store.dispatch('fetchSpecs')
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return fuzzysearch(value.toLowerCase(), data.label.toLowerCase())
    },
    selectNode(data, node) {
      let n = node
      const path = []
      while (n.parent) {
        path.unshift(n.data.value)
        n = n.parent
      }
      this.selectedOptions = ['all'].concat(path)
    },
    selectFolder(folder) {
      this.selectedOptions = this.selectedOptions.concat(folder.value)
    },
    clearOptions(e) {
      const { value } = e.target
      if (value === '') this.selectedOptions = [this.specs[0].value]
    },
    updateHash() {
      const path = this.selectedOptions.join('/')
      window.location.hash = encodeURI(path)
    }
  }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,500,600');

html,
body {
  margin: 0;
  padding: 0;
  color: #2c3e50;
  font-family: 'IBM Plex Sans', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
}

a {
  text-decoration: none;
}

.el-aside {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  .el-input {
    margin-bottom: 1rem;
  }
}

.el-tree-node__content {
  height: 34px;
  font-size: 16px;
}

.el-main {
  margin: 0 auto;
  padding: 20px 3rem;
}

.el-cascader {
  margin: 0 0.25rem 0.5rem;
  width: auto;

  .el-input__inner {
    width: auto;
    padding: 0;
    border: none;
  }

  .el-input__suffix {
    display: none;
  }

  .el-input,
  .el-cascader__label {
    width: auto;
    padding-left: 0.5rem;
    color: #2b2b2b;
    font: {
      size: 1.25rem;
      weight: 400;
    }
  }

  .el-cascader__label {
    padding-right: 2rem;
    border-radius: 4px;
    transition: all 0.25s ease;

    &::after {
      font-family: element-icons;
      content: '\E60E';
      position: absolute;
      right: 0.5rem;
      transform: rotate(90deg);
      color: #c0c4cc;
      font-size: 16px;
      text-align: center;
      transition: all 0.25s ease;
    }

    &:hover {
      background-color: #f1f3f4;
    }
  }

  .el-cascader__label span {
    display: inline-block;
    width: 20px;
    text-align: center;
    transition: all 0.25s ease;

    &::after {
      font-family: element-icons;
      content: '\E604';
      font-size: 16px;
    }
  }

  &:focus-within {
    .el-cascader__label {
      color: #409eff;
      background-color: #f5f7fa;
      span,
      &::after {
        color: #409eff;
      }
    }
  }
}

.el-tree__content {
  height: 36px;
}

.el-tag {
  float: right;
  padding: 0 0.5rem;
  border-radius: 10px;
}

.line {
  margin: 0rem 0.5rem 2rem;
  border: none;
  border-bottom: 1px solid #e2e2e2;
}

.title {
  margin: 0 0.5rem;
  color: #646364;
  font: {
    size: 0.825rem;
    weight: 600;
  }
}

.grid {
  display: flex;
  flex-flow: row wrap;
  margin: 0 -1rem 4rem;
}

.grid-item {
  flex: 0 0 auto;
  margin: 1rem;
}

.time {
  font-size: 0.75rem;
  color: #646364;
}

.folder-card {
  width: 175px;
  cursor: pointer;

  .el-card__body {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
}

.folder-icon {
  margin-right: 1rem;
}

.spec-card {
  padding: 0;
  width: 255px;
}

.spec-image {
  position: relative;
  width: 100%;
  height: 118px;
  overflow: hidden;
  background-color: rgb(247, 247, 247);

  img {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    transform: translateY(-50%);
  }
}

.spec-bottom {
  padding: 1rem;
}
</style>
