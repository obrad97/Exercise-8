var telloReplica = (function () {
    const list = document.querySelectorAll('.list-items');
    let dragListStartIndex;
    let current;
    let listArr = [];
    function addEventListeners () {
        const listItems = document.querySelectorAll('.list-item');
        const showAddInput = document.querySelectorAll('.add-item-label');
        const saveBtn = document.querySelectorAll('.add-item-btn');
        listItems.forEach(item => {
            item.addEventListener('dragstart', dragStart);
            item.addEventListener('drop', itemDragDrop);
        })

        list.forEach(element => {
            element.addEventListener('dragover', dragOver);
            element.addEventListener('drop', listDragDrop);
        })

        showAddInput.forEach((elem) => {
            elem.addEventListener('click', showAddItemInput)
        });

        saveBtn.forEach(btn => {
            btn.addEventListener('click', addItem)
        })
    }

    function dragStart () {
        dragListStartIndex = +this.closest('.list-items').getAttribute('list-index');
        current = this;
    }

    function dragOver (e) {
        e.preventDefault();
    }

    function listDragDrop () {
        const dragListEndIndex = +this.getAttribute('list-index');
        if (dragListStartIndex == dragListEndIndex) {
            return
        }else {
        swapItemsOutside(dragListStartIndex, dragListEndIndex);
        }
    }

    function swapItemsOutside (fromIndex, toIndex) {
        const draggable = current;
        list[toIndex].appendChild(draggable);
        const items = list[toIndex].querySelectorAll('.list-item');
        saveData ();
    }

    function itemDragDrop(e) {
        e.preventDefault();
        const dragListEndIndex = +this.parentElement.getAttribute('list-index');
        if (dragListStartIndex != dragListEndIndex) {
            return
        }else {
            swapItemsInside(this);
        }
    }

    function swapItemsInside (elm) {
        const parent = elm.parentElement;
        const currentList = parent.querySelectorAll('.list-item');
        if (elm != current) {
            let currentpos = 0;
            let droppedpos = 0;
            for(let i=0; i<currentList.length; i++) {
                if(current == currentList[i]){
                    currentpos = i;
                }
                if (elm == currentList[i]) {
                    droppedpos = i;
                }
                if (currentpos < droppedpos){
                    parent.insertBefore(current, elm.nextSibling)
                } else {
                    parent.insertBefore(current, elm)
                }
            }
            saveData ();
        }
    }

    function showAddItemInput (){
        const parent = this.parentElement;
        const input = parent.querySelector('.add-item-input')
        const btn = parent.querySelector('.add-item-btn');
        input.classList.toggle('active');
        btn.classList.toggle('active')
    }

    function addItem () {
        const input = this.previousElementSibling;
        const list = this.parentElement.previousElementSibling;
        if (input.value != ''){
            const newItem = document.createElement('div');
            newItem.classList.add('list-item');
            newItem.setAttribute('draggable', "true");
            newItem.innerHTML = `<p>${input.value}</p>`;
            list.appendChild(newItem);
            input.classList.toggle('active');
            input.value = null;
            this.classList.toggle('active');
            saveData ();
        }
        addEventListeners();
    }

    addEventListeners();

    function saveData () {
        listArr = [];
        for (let i=0; i<list.length; i++) {
            let arr = []
            listArr.push(arr)
        }
        for(let i=0; i < listArr.length; i++) {
            let listItems = list[i].querySelectorAll('p');
            listItems.forEach((item, index) => {
                let text = item.innerText;
                listArr[i].push(text);
            })
        }
        sessionStorage.setItem('data', JSON.stringify(listArr));
    }

    function loadData () {
        let savedData = JSON.parse(sessionStorage.getItem('data'));
        if (savedData) {
            for(let i=0; i < list.length; i++) {
                let items = list[i].querySelectorAll('.list-item');
                items.forEach(item => {
                    item.remove();
                })
            }

            for(let i = 0; i < savedData.length; i++) {
                for(let j = 0; j < savedData[i].length; j++) {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('list-item');
                    itemDiv.setAttribute('draggable', 'true');
                    itemDiv.innerHTML= `<p>${savedData[i][j]}</p>`
                    list[i].appendChild(itemDiv);
                }
            }
            addEventListeners();
        }
    }

    return {loadData}
})();

window.onload = function () {
    telloReplica.loadData();
}
