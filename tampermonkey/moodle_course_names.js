// ==UserScript==
// @name         moodle_course_names
// @version      0.1
// @description  Displays courses' names instead of random numbers!
// @author       Eduardo Nazário (powy-e)
// @match        https://moodle.novasbe.pt/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=novasbe.pt
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...

    let a = document.getElementById("nav-drawer").getElementsByTagName("nav"); // All nav on the sidebar
    const len = a.length;
    for (let i = 0; i < len; i++) { // For each nav
        let childs = a[i].children;
        const num_ul = childs.length;
        for (let j = 0; j < num_ul; j++) { // For each ul in that nav
            let ul_children = childs[j].children;
            const num_li = ul_children.length;
            for (let k = 0; k < num_li; k++) {
                // for every li find "My courses"
                if (ul_children[k].textContent.trim() == "My courses") { // FOUND "My courses", courses should follow
                    return getReplaceDataFromInnerPages(ul_children, k + 1, num_li);
                }
            }
        }
    }
})();

async function getReplaceDataFromInnerPages(ul_children, first_li_index, ul_length) {
    for (; first_li_index < ul_length; first_li_index++) {
        // for every li
        getReplaceDataFromPage(ul_children[first_li_index]);
    }

}

async function getReplaceDataFromPage(li, index) {
    let response = await fetch(li.firstElementChild.href) // fetch website
    let data = await response.text(); // get the actual HTML as text

    let parser = new DOMParser();
    let new_page = parser.parseFromString(data, "text/html");
    let title = new_page.getElementsByTagName("title")[0].text.replace("Course:", "").trim().split("-"); // Extract title from page

    let k;
    if (title.length < 3) k = 0; else k = 1;
    let name = title[k];
    li.getElementsByClassName("media-body")[0].textContent = name;
}
