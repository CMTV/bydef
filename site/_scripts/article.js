var ByDef = ByDef || {};

Vue.component('proof', {
    data() {
        return {
            opened: false
        }
    }
});

Vue.component('task', {
    data() {
        return {
            showing: {
                answer: false,
                solution: false,
                hint: false
            }
        }
    },

    methods:
    {
        showAnswer()
        {
            this.$data.showing.answer = !this.$data.showing.answer;
            this.$data.showing.solution = false;
            this.$data.showing.hint = false;
        },

        showSolution()
        {
            this.$data.showing.answer = false;
            this.$data.showing.solution = !this.$data.showing.solution;
            this.$data.showing.hint = false;  
        },

        showHint()
        {
            this.$data.showing.answer = false;
            this.$data.showing.solution = false;
            this.$data.showing.hint = !this.$data.showing.hint;
        }
    }
});

window.onload = () =>
{
    // Proofs
    document.querySelectorAll('article proof').forEach((element) => { new Vue({ el: element }) });

    // Tasks
    document.querySelectorAll('task').forEach((element) => { new Vue({ el: element }) });

    ByDef.aside = new Vue({
        el: '#aside',
        
        data:
        {
            asideSwitcher: null,
            headers: [],
            showing: false,
            tocButtonText: 'Оглавление',
            tocButtonTextOpposite: 'Содержание'
        },

        methods:
        {
            toggleAside()
            {
                this.$data.asideSwitcher.classList.toggle('_active');
                this.$data.showing = !this.$data.showing;
            },

            toggleToc()
            {
                let temp = this.$data.tocButtonText;
                
                this.$data.tocButtonText = this.$data.tocButtonTextOpposite;
                this.$data.tocButtonTextOpposite = temp;
            },

            updateCurrentHeader(edgeY)
            {
                let leftI = 0;
                let rightI = this.$data.headers.length;
                let currentI = 0;

                while (leftI < rightI)
                {
                    let middleI = (leftI + rightI)/2|0;
                    let middleH = this.$data.headers[middleI];
                    let middleH_pos = middleH.getBoundingClientRect().top + window.scrollY;

                    if (edgeY <= middleH_pos)
                    {
                        rightI = middleI;
                    }
                    else
                    {
                        currentI = middleI;
                        leftI = middleI + 1;
                    }
                }

                document.querySelectorAll(`.header`).forEach(header => header.classList.remove('current'));
                document.querySelector(`.header[data-index="${currentI}"]`).classList.add('current');
            }
        },

        beforeMount()
        {
            this.$data.asideSwitcher = document.getElementById('aside-switcher');
            this.$data.asideSwitcher.onclick = () =>
            {
                this.toggleAside();
            }

            document.querySelectorAll('.header').forEach((header) =>
            {
                this.$data.headers.push(document.getElementById(header.dataset.id));
            });

            ['DOMContentLoaded', 'load', 'resize', 'scroll'].forEach((eventName) =>
            {
                window.addEventListener(eventName, () =>
                {
                    this.updateCurrentHeader(window.scrollY + 80);
                });
            });
        },

        mounted()
        {
            this.updateCurrentHeader(window.scrollY + 80);

            this.$nextTick(() =>
            {
                setTimeout(() => {
                    MathJax.startup.defaultReady();
                }, 0);
            });
        }
    });
}