import { imageExists } from "./utiles";

export function setupGlobalEvents() {

    document.querySelector('#dropzone')?.addEventListener('click', event => {
        event.stopPropagation();
    });

    // Trigger onMouseOver
    //document.addEventListener('mouseover', event => {
    //    onMouseOver(event);
    //});

    //document.addEventListener('mouseout', event => {
    //    event;
    //    remClassProcessor('border-props');
    //});         
}

export function uuidv4() {
    return 'uuid' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}



export function onDragStart(event: any) {
    console.log(' > onDrag_START() ');

    event
        .dataTransfer
        .setData('text/plain', event.target.id);

    event
        .currentTarget
        .style
        .backgroundColor = 'white';

    onSave(event);
}

export function onDragOver(event: any) {
    console.log(' > onDrag_OVER() ');

    let dropIndicator = <HTMLElement>document.getElementById('drop-here-indicator');
    dropIndicator.style.display = 'none';

    // Remove all previous    
    remClassProcessor('border-dotted');

    event.target.classList.add('border-dotted');
    event.preventDefault();
}
const onPutDelete = (component: any) => {
    console.log("' > onReposition() '")
    const editableComponent = component;

    const spanElement = document.createElement("span");
    spanElement.innerHTML = "<i class='fa-solid fa-xmark'></i>";
    spanElement.className = "cross-icon";
    spanElement.onclick = function() {
        onDelete(editableComponent);
    };

    const contentElement = document.createElement("span");
    contentElement.innerHTML = editableComponent.innerHTML.trim();
    contentElement.style.display = "block";
    contentElement.id = editableComponent.id;
    contentElement.onclick = function(event) {
        onClick( event )
    };

    editableComponent.innerHTML = "";
    editableComponent.appendChild(spanElement);
    editableComponent.appendChild(contentElement);
}
const onReposition = (component: any) => {
    console.log("' > onReposition() '")
    const editableComponent = component;

    const upElement = document.createElement("span");
    upElement.innerHTML = "<i class='fa-solid fa-caret-up'></i>";
    upElement.className = "upButton";
    upElement.onclick = function() {
        var prevElement = editableComponent.previousElementSibling;
        if (prevElement) {
            editableComponent.parentNode?.insertBefore(editableComponent, prevElement);
        }
    }

    const downElement = document.createElement("span");
    downElement.innerHTML = "<i class='fa-solid fa-caret-down'></i>";
    downElement.className = "downButton";
    downElement.onclick = function() {
        var nextElement = editableComponent.nextElementSibling;
        if (nextElement) {
            editableComponent.parentNode?.insertBefore(nextElement, editableComponent);
        }
    }

    const spanElement = document.createElement("span");
    spanElement.innerHTML = "<i class='fa-solid fa-xmark'></i>";
    spanElement.className = "cross-icon";
    spanElement.onclick = function() {
        onDelete(editableComponent);
    };

    const contentElement = document.createElement("span");
    contentElement.innerHTML = editableComponent.innerHTML.trim();
    contentElement.style.display = "block";
    contentElement.id = editableComponent.id;
    contentElement.onclick = function(event) {
        onClick( event )
    };

    editableComponent.innerHTML = "";
    editableComponent.appendChild(upElement);
    editableComponent.appendChild(downElement);
    editableComponent.appendChild(spanElement);
    editableComponent.appendChild(contentElement);
}

export function onDragEnd(event: any) {
    console.log(' > onDrag_END() ');

    // Remove all previous    
    remClassProcessor('border-dotted');

    event
        .dataTransfer
        .setData('text/plain', event.target.id);

    event
        .currentTarget
        .style
        .backgroundColor = '#ffffff';
}

export function onDrop(event: any) {

    console.log(' > on_DROP() ');

    const id = event.dataTransfer.getData('text');

    let editableComponent = <HTMLElement>document.getElementById(id)!.cloneNode(true);
    let content = <HTMLElement>document.querySelector('.drop-indicator');

    if (content) {
        content.className = "d-none";
    }

    console.log(' > CONTAINER: ' + event.target.id);
    console.log(' > Component: ' + editableComponent.dataset.type);

    // Customization
    editableComponent.id = uuidv4();

    if (event.target.id?.includes('grid-')) {
        event.target.innerHTML = '';
    }

    //editableComponent.innerHTML += editableComponent.id;
    editableComponent.classList.remove('draggable');
    editableComponent.classList.add('component');
    editableComponent.removeAttribute('draggable');
    console.log(event.target.id, "))my-target");
    // Some Stuff 
    if (event.target.id == "dropzone") {
        onReposition(editableComponent);    // reorder & delete
    } else {
        onPutDelete(editableComponent);     // put only delete
    }

    // Make it CLICK-able
    editableComponent.addEventListener('click', (event) => { onClick(event); });

    // Activate Mouse Over
    editableComponent.addEventListener('mouseover', (event) => { onMouseOver(event); });
    //editableComponent.addEventListener('mouseout', (event) => { event; remClassProcessor('border-props'); });

    // Inject component in the builder
    //const dropzone = <HTMLElement>document.querySelector('#dropzone');
    //dropzone.appendChild(editableComponent);
    event.target.appendChild(editableComponent);

    // Done with this event
    event.dataTransfer.clearData();
}

export function onDelete(element: any) {

    console.log(' > on_DELETE() ');

    element.style.display = "none";
    const localStorageData = window.localStorage.getItem('editME')?.split("dropzone")[1] || "";

    var div = document.createElement('div');
    div.id = 'dropzone';
    div.innerHTML = localStorageData.trim();

    const children = Array.from(div.children);
    const updatedData = children.filter(item => item.id !== element.id);

    div.innerHTML = 'dropzone';
    updatedData.forEach(item => {
        div.appendChild(item);
    });

    // window.localStorage.setItem('editME', div.innerHTML)
}

export function getElemName(aElement: HTMLElement) {

    let aNodeType = aElement.nodeName;

    if ('P' === aNodeType) {
        return 'Paragraph';
    } else if ('A' === aNodeType) {
        return 'Anchor';
    } else if ('DIV' === aNodeType) {
        return 'DIV';
    } else if ('H5' === aNodeType) {
        return 'H5 Tag';
    } else {
        return aNodeType;
    }
}

export function getElemProps(aElement: HTMLElement) {

    let aNodeType = aElement.nodeName;

    if ('P' === aNodeType) {
        return 'CSS, HtmlEdit';
    } else if ('A' === aNodeType) {
        return 'CSS, HREF'; // + aElement.getAttribute('href');
    } else if ('DIV' === aNodeType) {
        return 'CSS, HtmlEdit';
    } else if ('H5' === aNodeType) {
        return 'CSS, HtmlEdit';
    } else {
        return aNodeType.trim();
    }
}

export function onMouseOver(event: any) {

    console.log(' > on_MouseOver()');

    if (!event.target.id) {
        event.target.id = uuidv4();
    }

    let elem = <HTMLElement>document.getElementById(event.target.id);

    console.log(' > id: ' + elem.id);
    console.log(' > type: ' + elem.nodeName);

    // let PROPS_TITLE   = <HTMLElement>document.getElementById('builder-props-title');
    // let PROPS_CONTENT = <HTMLElement>document.getElementById('builder-props-content');

    // PROPS_TITLE.innerHTML    = elem.id;
    // PROPS_CONTENT.innerHTML  = '<br /><hr />';
    // PROPS_CONTENT.innerHTML += '<strong><center>'+getElemName(elem)+'</center></strong>';
    // PROPS_CONTENT.innerHTML += '<hr /><br />';
    // PROPS_CONTENT.innerHTML += '<p>'+getElemProps(elem)+'</p>';

    let targetComponent = event.target;

    // Remove previous 
    remClassProcessor('border-props');

    // Update CSS
    targetComponent.classList.add('border-props');
}

export function onClick(event: any) {

    console.log(' > on_CLICK() ');

    let targetComponent;

    if (event.target.classList.contains('component')) {
        targetComponent = event.target;
    } else {
        targetComponent = event.target.closest('.component');
    }

    if (targetComponent.id && !(targetComponent.id.includes('uuid'))) {
        console.log(' > GRID Component, skip the edit');
        event.preventDefault();
        return;
    }

    // Save the active Component
    window.localStorage.setItem("activeComponent", targetComponent.id);

    // In place edit
    targetComponent.contentEditable = 'true';

    console.log(' > ACTIVE Component: ' + targetComponent.id);

    // Remove previous 
    remClassProcessor('border-dotted');

    // Update CSS
    targetComponent.classList.add('border-dotted');

    if (!hasSiblings(event.target)) {
        let elem = <HTMLElement>document.getElementById(event.target.id);

        let propsPanel_title = <HTMLElement>document.querySelector('#builder-props-title');
        let propsPanel_content = <HTMLElement>document.querySelector('#builder-props-content');
        let propsPanel_attribute = <HTMLElement>document.querySelector('#builder-props-attribute');

        propsPanel_title.className = "p-2 rounded-1 border mb-2 bg-light text-center";
        propsPanel_content.className = "rounded-1";
        propsPanel_attribute.className = "rounded-1";

        propsPanel_title.innerHTML = 'Component<br />' + event.target.id;

        if (elem?.nodeName !== "IMG")
            propsPanel_content.innerHTML = '<div class="newClass"><input id="props_text" class="form-control text-left" data-target="' + event.target.id + '" value="' + event.target.innerHTML + '" /></div>';

        let selectedComponent = event.target;
<<<<<<< HEAD
        if (elem?.nodeName === "A" || elem?.nodeName === "IMG") {
=======
        let propsPanel_attr_input, propsPanel_input;
        if (elem?.nodeName && (elem.nodeName === "A" || elem.nodeName === "IMG")) {
>>>>>>> 5c95bc7a17888be14bf1fc43a1bd4dab0b8410fe
            const attrVal = elem.nodeName === "A" ? event.target.href : event.target.src;
            propsPanel_attribute.innerHTML = '<div class="newClass"><input id="props_attribute" class="form-control" data-target="' + event.target.id + '" value="' + attrVal + '" /></div>';
            propsPanel_attr_input = <HTMLElement>document.querySelector('input#props_attribute');
            propsPanel_attr_input.addEventListener('keyup', (event) => { onKeyUp(event, selectedComponent, elem.nodeName); });

            if (elem.nodeName === "IMG") {
                propsPanel_input = <HTMLElement>document.querySelector('input#props_text');
                propsPanel_input?.remove();
            }
        } else {
            propsPanel_attr_input = <HTMLElement>document.querySelector('input#props_attribute');
            propsPanel_attr_input?.remove();
        }

        propsPanel_input = <HTMLElement>document.querySelector('input#props_text');
        propsPanel_input?.addEventListener('keyup', (event) => { onKeyUp(event, selectedComponent, 'content'); });

    } else {
        console.log(' > Nested COMPONENT, skip PROPS');
    }

    event.stopPropagation();
    event.preventDefault();
}

export function hasSiblings(aNode: HTMLElement) {

    if (!aNode)
        return false;

    let siblings = [];
    let sibling = aNode.firstChild;

    while (sibling) {
        if (sibling.nodeType === 1) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }

    if (siblings.length > 0)
        return true;
    else
        return false;
}

export function remClassProcessor(aClass: string) {

    let elems = document.getElementsByClassName(aClass);

    if (elems) {
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.remove(aClass);
        }
    }
}

export async function onKeyUp(event: any, target: any, flag: string) {
    // if (event.keyCode !== 13) return;
    event;
    const target_id = target.id;

    let activeComponent = document.querySelector('#' + target_id);

    if (activeComponent) {
        if (flag === 'A') {
            activeComponent.setAttribute('href', event.target.value);
        } else if (flag === 'IMG') {
            if (await imageExists(event.target.value)){
                activeComponent.setAttribute('src', event.target.value);
                if(document.getElementsByClassName("img-warning")?.length > 0) document.querySelector(".img-warning")?.remove();
            } else {
                if(document.getElementsByClassName("img-warning")?.length === 0){
                    let imgAttrinput = event.target;
                    imgAttrinput.insertAdjacentHTML('afterend', '<div class="img-warning"><img src="/img/warning.png" width="35" alt="W" /></div>');
                }
            }

        } else {
            activeComponent.innerHTML = event.target.value;
        }
    } else {
        console.log(' > NULL target:' + target_id);
    }
    //}    
}

export function onClear(event: any) {
    event;
    console.log(' > ACTION: clear');
    let content = <HTMLElement>document.querySelector('#dropzone');
    // clear
    let info = '<div class="drop-indicator d-flex align-items-center justify-content-center"><div class="p-4 shadow bg-white rounded-3 text-center"><span class="icon text-primary h3"><i class="fa-solid fa-circle-plus"></i></span><h6 class="mt-3">Drop Here...</h6></div></div>'
    content.innerHTML = info;
    window.localStorage.clear();
    //let builderContainer = document.querySelector('#layout')!.innerHTML;
    //document.querySelector<HTMLDivElement>('#app')!.innerHTML = builderContainer;    
}

export function onSave(event: any) {
    event;
    console.log(' > ACTION: save');
    let content = <HTMLElement>document.querySelector('#dropzone');
    window.localStorage.setItem("editME", content.innerHTML);
}

export function onRestore(event: any) {

    event; // fake the usage

    console.log(' > ACTION: restore');
    let content = <HTMLElement>document.querySelector('#dropzone');

    let saved_content = <string>window.localStorage.getItem("editME");

    // Check that we have data to restore
    if (!saved_content) {
        return;
    }

    // update
    content.innerHTML = saved_content;

    let elems = content.getElementsByClassName("component");

    if (elems) {
        for (let i = 0; i < elems.length; i++) {
            const draggableElement = elems[i];

            draggableElement.addEventListener('click', onClick);

            const upButton = draggableElement.querySelector('.upButton');
            const downButton = draggableElement.querySelector('.downButton');
            const crossButton = draggableElement.querySelector('.cross-icon');
            const parentElement = draggableElement.parentElement;

            if (parentElement) {
                if (upButton) {
                    upButton.addEventListener('click', function() {
                        const currentIndex = Array.from(parentElement.children).indexOf(draggableElement);
                        if (currentIndex > 0) {
                            const previousElement = parentElement.children[currentIndex - 1];
                            parentElement.insertBefore(draggableElement, previousElement); 
                        } 
                    });
                }
                if (downButton) {
                    downButton.addEventListener('click', function() {  
                        const currentIndex = Array.from(parentElement.children).indexOf(draggableElement);
                        if (currentIndex < parentElement.children.length - 1) {
                            const nextElement = parentElement.children[currentIndex + 1];
                            parentElement.insertBefore(nextElement, draggableElement);
                        }
                    });
                }
                if (crossButton) {
                    crossButton.addEventListener('click', function() {  
                        onDelete(draggableElement);
                    });
                }
            }
        }
    } else {
        console.log(' > NULL ELEMs ');
    }
}

