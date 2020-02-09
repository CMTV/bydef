var ByDef = ByDef || {};

Vue.component('toc-article', {
    data() {
        return {
            headersShowing: false 
        }
    },
    
    methods:
    {
        toggleHeaders() { this.$data.headersShowing = !this.$data.headersShowing; }
    }
});

Vue.component('index-container', {
    props: {
        dataTotal: Number
    },

    data() {
        return {
            search: '',
            showingNum: this.dataTotal
        }
    },

    computed:
    {
        searchQuery()
        {
            return this.search.toLowerCase();
        }
    }
});

Vue.component('index-item', {
    props: ['data-id', 'data-name'],

    data() {
        return {
            metaShowing: false
        }
    },

    computed:
    {
        name()
        {
            return this.dataName.toLowerCase();
        },

        showing()
        {
            return this.name.includes(this.$parent.searchQuery);
        }
    },

    watch:
    {
        showing()
        {
            if (this.showing)
                this.$parent.showingNum++;
            else
                this.$parent.showingNum--;
        }
    },

    methods:
    {
        toggleMeta()
        {
            this.metaShowing = !this.metaShowing;
            if (this.metaShowing) this.$refs.meta.load();
        }
    }
});

Vue.component('index-meta', {
    props: ['data-meta'],

    data()
    {
        return {
            canBeLoaded: true,
            isLoading: true,
            metaContent: ''
        }
    },

    methods:
    {
        load()
        {
            if (!this.canBeLoaded) return;
            this.canBeLoaded = false;

            axios.get(this.dataMeta).then(response => {
                let metaData = response.data;                
            
                // Synonyms
                if (metaData.synonyms)
                {
                    let out = `<ul>`

                    metaData.synonyms.forEach(synonym => {
                        out += `<li>${synonym}</li>`;
                    });

                    out += `</ul>`;

                    this.addMeta('synonyms', 'Синонимы', out);
                }

                // Description
                this.addMeta('description', 'Описание', metaData.description);

                // Denote
                this.addMeta('denote', 'Обозначение', metaData.denote);

                // Examples
                this.addMeta('examples', 'Примеры', metaData.examples);
                
                this.isLoading = false;
            });
        },

        addMeta(name, title, content)
        {
            if (!content) return;

            this.metaContent += `
                <div class="metaBlock metaBlock--${name}">
                    <div class="metaBlock-title">${title}</div>
                    <div class="metaBlock-content">${content}</div>
                </div>
            `;
        }
    },

    computed:
    {
        anyMetaExceptDesc()
        {
            return this.metaBlocks.synonyms || this.metaBlocks.denote || this.metaBlocks.examples;
        }
    }
});

window.onload = () =>
{
    //
    // Book Nav
    //

    ByDef.bookInfo = new Vue({
        el: '.book-info',

        data:
        {
            toc: true,
            index: false,
            contributors: false
        },

        methods:
        {
            bookTabClick: function (tabName)
            {
                history.replaceState(null, '', location.href.split('#')[0] + '#' + tabName);

                this.$data.toc =            (tabName === 'toc');
                this.$data.index =          (tabName === 'index');
                this.$data.contributors =   (tabName === 'contributors');
            }
        },

        created()
        {
            if (location.hash.length > 1)
            {
                this.bookTabClick(location.hash.substr(1));
            }
        }
    });
}