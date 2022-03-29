<template>
  <k-inside>
    <k-view class="trevor">
      <k-header class="heading">{{$t('trevor.heading')}}</k-header>

      <div class="editor">
        <div class="keys"
        @keydown.down="selectNext"
        @keydown.up="selectPrev"
        >
          <div
            v-for="k of languagekeys"
            :class="['key', {
              selected: selected == k,
              edited: edited.has(k)
            }]"
            :key="k"
            @click="selectOne(k)"
            tabindex="-1"
            ref="keyspane">
              <div class="txt">{{k}}</div>
              <div class="missing" v-if="missing.has(k)"></div>
          </div>

        </div>
        <div class="ctrl">
          <k-button icon="add" @click="add">{{$t('add')}}</k-button>
        </div>
        <div class="texts">
          <div
            v-if="selected"
            @keydown.up.ctrl="selectPrev"
            @keydown.down.ctrl="selectNext"
          >
            <div class="lang" v-for="[code, lang] of languages" :key="code">
              <k-textarea-field
                :ref="`input_${code}`"
                @input="edited.add(selected)"
                v-model="lang.translations[selected]"
                :buttons="false"
                :label="lang.name + (lang.default?' *':'')" />
            </div>
          </div>
          <div class="no-selection" v-else>
            <div class="text">
              <p>{{$t('trevor.startinfo')}}</p>
              <p><b>Trevor</b>: {{$t('trevor.payoff')}}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="savebar" v-if="edited.size">
        <k-view>
          <k-button icon="undo" @click="revert">{{$t('revert')}}</k-button>
          <k-button icon="check" @click="save">{{$t('save')}}</k-button>
        </k-view>
      </div>
    </k-view>
  </k-inside>
</template>

<script>
export default {
  computed: {
    languagekeys() {
      const set = new Set()
      for(let [code, lang] of this.languages) {
        Object.keys(lang.translations).forEach(k => set.add(k));
      }
      return Array.from(set);
    },
    missing() {
      const set = new Set()
      for(let k of this.languagekeys) {
        for(let [code, lang] of this.languages) {
          if(lang.translations[k] === undefined || lang.translations[k].trim() === '') {
            set.add(k);
          }
        }
      }
      return set;
    }
  },
  data: function() {
    return {
      edited: new Set(),
      languages: [],
      selected: null,
    };
  },
  created: function() {
    this.fetch();
    this.$events.$on("keydown.cmd.s", this.onCmdS);
  },
  destroyed: function() {
    this.$events.$off("keydown.cmd.s", this.onCmdS);
  },
  methods: {
    fetch() {
      this.$api.get('trevor/languages')
        .then(d => {
          this.languages = Object.entries(d).sort(([code_a, a], [code_b, b]) => {
            if(a.default) return -1;
            if(b.default) return 1;

            return code_a.localeCompare(code_b);
          })
        })
    },
    add() {
      let k = window.prompt(this.$t('trevor.addkey'));
      if(!k) {
        return;
      }
      k = k.toLowerCase()

      if(this.languagekeys.indexOf(k.trim()) === -1) {

        if(this.languages.length) {
          this.$set(this.languages[0][1].translations, k, '');
        }

        this.edited.add(k)
      }
      this.$nextTick(() => this.selectOne(k))
    },
    selectOne(k) {
      this.selected = k;

      //scroll into view
      const idx = this.languagekeys.indexOf(k);
      this.$refs.keyspane[idx].scrollIntoView({block: "nearest"});

      //if there is a language without translation, focus that input.
      this.$nextTick(() => {
        for(let [code, lang] of this.languages) {
          if(lang.translations[k] === undefined || lang.translations[k].trim() === '') {
            let inputs = null;
            if(inputs = this.$refs[`input_${code}`]) {
              inputs[0].focus();
              return;
            }
          }
        }
      })
    },
    selectPrev() {
      const idx = this.languagekeys.indexOf(this.selected);
      const nidx = Math.max(0, idx - 1);
      this.selectOne(this.languagekeys[nidx]);
    },
    selectNext() {
      const idx = this.languagekeys.indexOf(this.selected);
      const nidx = Math.min(this.languagekeys.length - 1, idx + 1);
      this.selectOne(this.languagekeys[nidx]);
    },
    onCmdS(e) {
      e.preventDefault();
      this.save();
    },
    save() {
      if(this.edited.size === 0)return;

      const patch = {};

      for(let [code, lang] of this.languages) {
        patch[code] = {};
        for(let k of this.edited) {
          patch[code][k] = lang.translations[k];
        }
      }

      this.$api.patch('trevor/languages/translations', patch)
        .then(this.fetch);

      this.edited = new Set();
    },
    revert() {
      this.languages = [];
      this.edited = new Set();
      this.fetch();
    }
  }

}
</script>

<style scoped>

.trevor {
  height: 100%;
  display: grid;
  grid-gap: 0 1rem;
  grid-template:"heading heading"
                "keys    text" 1fr
                "ctrl    text"
                / 1fr 3fr;
}

.heading {
  grid-area: heading;
}

.editor {
  display: contents;
}

.keys {
  grid-area: keys;
  overflow-y: auto;
  background: #fbfbfb;
}

.key {
  background: #fff;
  padding: 0.7rem 0.5rem;
  border-bottom: 1px solid #f3f3f3;
  display: flex;
  align-items: center;
}

.key.selected {
  box-shadow: 0 0 8px inset #ccc;
}

.key.edited {
  background-color: lightyellow;
}

.key .txt {
  flex-grow: 1;
}

.key .missing {
  display: block;
  height: 0.8rem;
  width: 0.8rem;
  border-radius: 0.4rem;
  border: 1px solid #9a0202;
  background-color: red;
}

.key:focus {
  outline: none;
}

.ctrl {
  grid-area: ctrl;
  text-align: end;
  background: #fbfbfb;
  padding: 0.5rem;
}

.texts {
  grid-area: text;
  overflow-y: auto;
}

.texts > * {
  height: 100%;
}

.no-selection {
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.7;

  font-style: italic;
}

.lang {
  margin-bottom: 2rem;
}

.savebar {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  background-color: #de935f;
}

.savebar .k-view {
  display: flex;
  justify-content: space-between;
  height: 40px;
}
</style>
