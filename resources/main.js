const dataWiki = [];
const dataAbbrv = [];

document.addEventListener('DOMContentLoaded', function () {

    async function fetchNewsdata() {
        try {
            debugger;
            const response = await fetch('https://newsdata.io/api/1/news?apikey=pub_48290aed27ff3a224875151ae01fc6a504c03&q=cybersecurity');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const articles = await response.json();
            document.getElementById('contentPage').innerHTML = '';
            //document.getElementById('contentPage').innerHTML = `<div class="row">`;
            const news = [];
            articles.results.forEach(el => {
                if (el.language == "english") {
                    news.push(`
                        <div class="col-sm-12 col-md-6 col-lg-6 d-flex flex-column p-3 text-white text-shadow-1">
                            <div class="dark-shadow">
                                <div>
                                    <h5 class="card-title cyan-title">${el.title}</h5>
                                    <p class="card-text cut-text">
                                    ${el.description || ''}
                                    </p>
                                    <a href="${el.link}" class="card-link">Read more</a>
                                </div>
                                <div class="card-footer text-muted">
                                    ${el.pubDate}
                                </div>
                            </div>
                        </div>`);
                }
            });
            //debugger;
            document.getElementById('contentPage').innerHTML = `<div class="row">${news.join('')}</div>`;
        } catch (error) {
            console.error('Error fetching news:', error);
            document.getElementById('news-container').innerText = 'Error fetching news';
        }
    }

    fetch("./data/data.json")
        .then(response => response.text())
        .then(data => {
            const parsed = JSON.parse(data);
            parsed.forEach(item => {

                document.getElementById("sidebar-nav").innerHTML += `<a href="#" data-url="${item.path}" data-target="${item.category}">
                                <i class="ph-browsers"></i>
                                <span class="cs-span cut-text">${item.category.replace("_", " ")}</span>
                            </a>`;

                item.tabs.forEach(t => {
                    document.getElementById("horizontal-tabs").innerHTML +=
                    `<li class="nav-item">
                        <a href="#" data-parent="${item.category}" data-path="${t.path}" data-name="${t.category}" aria-current="page" class="nav-link hidden">${t.category}</a>
                    </li>`;
                });

                document.querySelectorAll('.nav-tabs a').forEach(tab => {
                    tab.addEventListener('click', function (event) {
                        event.preventDefault();
                        const current = event.target;
                        const dataset = current.dataset;

                        if (dataset.name == "top") {
                            scrollToTop();
                            return;
                        }

                        if (dataset.name == "Newsdata.io")
                            fetchNewsdata();                                    
                        else if (dataset.name == "NIST")
                            fetchNISTRss();
                        else if (dataset.name == "TheHackerNews")
                            fetchTheHackerNewsRss();
                        else if (dataset.name == "NCSC")
                            fetchNCSCRss();
                        else if (dataset.name == "Tools")
                            fetchTools(dataset.path);
                        else if (dataset.name == "Practice")
                            fetchPractice(dataset.path);
                        else if (dataset.path.includes('.md'))
                            fetchMarkdown(dataset.path);
                        else if (dataset.name == "Pathway")
                            fetchPathway(dataset.path);
                        else if (dataset.name == "Wiki")
                            fetchWiki(dataset.path)
                        else if (dataset.name == "Abbrvs")
                            fetchAbbrv(dataset.path);
                        else if (dataset.name == "Organizations")
                            fetchOrgs(dataset.path);
                        else if (dataset.name == "Youtube Channels")
                            fetchChannels(dataset.path);
                        else if (dataset.name == "Trainings")
                            fetchTrainings(dataset.path);
                        else if (dataset.name == "Documents")
                            fetchDocuments(dataset.path);
                    });
                });
            
                document.querySelectorAll('.custom-sidebar a').forEach(link => {                                
                    link.addEventListener('click', function (event) {
                        let current = '';
                        event.preventDefault();
                        const target = event.target;                                    
                        document.querySelectorAll('.nav-tabs a').forEach(tab => {
                            current = target.parentNode.dataset;
                            if(tab.dataset.parent == current.target)
                                tab.classList.replace("hidden", "show");
                            else
                                tab.classList.replace("show", "hidden");
                        });

                        const _type = current.url.includes('.md') ? 'no-page' : 'page';
                        if (_type === 'page') {
                            if(current.target == "Magazines") {
                                fetchMags(current.url);
                            }
                            else {                                           
                                document.getElementById('contentPage').innerHTML = fetchHtml(current.url);
                            }
                        }
                        else {
                            fetchMarkdown(current.url);
                        }
                    });                                
                });                                    
            })
        })
        .catch(error => console.error('Error loading Markdown file:', error));

    async function fetchJobs() {
        await fetchServer('./data/search_jobs.json')
        .then(json => {
            const jobs = [];
            json.forEach(job => {
            jobs.push(`<li class="list-group-item bg-dark text-white"> 
                <span class="p-1"> ${job.icon} </span>
                <a href="${job.url}"> ${job.site} </a>
                </li>`);
            });
            document.getElementById('search-jobs').innerHTML = jobs.join('');
        })
        .catch(error => console.error('Error loading Markdown file:', error));
    }
    fetchJobs();
    fetchMain();
});

//
async function fetchNCSCRss() {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.ncsc.gov.uk%2Fapi%2F1%2Fservices%2Fv1%2Fall-rss-feed.xml&api_key=locyjfdyybzfdlcaarwtol68ldqmmkb4r96rulz9');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const articles = [];
        if(data.items) {
            data.items.forEach(p => {
                const thn = `
                    <div class="col-sm-12 col-md-6 col-lg-6 d-flex flex-column p-3 text-white text-shadow-1">
                        <div class="dark-shadow">
                            <div>
                                <h5 class="card-title cyan-title">${p.title}</h5>
                                <p class="card-text cut-text">
                                    ${p.description || ''}
                                </p>
                                <a href="${p.link}" class="card-link">Read more</a>
                            </div>
                            <div class="card-footer text-muted">
                                ${new Date(p.pubDate).toLocaleDateString()}
                            </div>
                            <div><span class="pb-3 mb-0 small lh-sm c-777">Author: <br/> ${p.author}</span></div>
                        </div>
                    </div>
                `;
                articles.push(thn);
            });
            document.getElementById('contentPage').innerHTML = `<div class="row">${articles.join('')}</div>`;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-container').innerText = 'Error fetching news';
    }
}

async function fetchTheHackerNewsRss() {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.feedburner.com%2FTheHackersNews&api_key=locyjfdyybzfdlcaarwtol68ldqmmkb4r96rulz9');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const articles = [];
        if(data.items) {
            data.items.forEach(p => {
                const thn = `
                    <div class="col-sm-12 col-md-6 col-lg-6 d-flex flex-column p-3 text-white text-shadow-1">
                        <div class="dark-shadow">
                            <div>
                                <h5 class="card-title cyan-title">${p.title}</h5>
                                <p class="card-text cut-text">
                                    ${p.description || ''}
                                </p>
                                <a href="${p.link}" class="card-link">Read more</a>
                            </div>
                            <div class="card-footer text-muted">
                                ${new Date(p.pubDate).toLocaleDateString()}
                            </div>
                            <div><span class="pb-3 mb-0 small lh-sm c-777">Author: <br/> ${p.author}</span></div>
                        </div>
                    </div>
                `;
                articles.push(thn);
            });
            document.getElementById('contentPage').innerHTML = `<div class="row">${articles.join('')}</div>`;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-container').innerText = 'Error fetching news';
    }
}

async function fetchNISTRss() {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.nist.gov%2Fnews-events%2Fnews%2Frss.xml&api_key=locyjfdyybzfdlcaarwtol68ldqmmkb4r96rulz9');
        debugger;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const articles = [];
        if(data.items) {
            data.items.forEach(p => {
                const nist = `
                    <div class="col-sm-12 col-md-6 col-lg-6 d-flex flex-column p-3 text-white text-shadow-1">
                        <div class="dark-shadow">
                            <div>
                                <h5 class="card-title cyan-title">${p.title}</h5>
                                <p class="card-text cut-text">
                                    ${p.description || ''}
                                </p>
                                <a href="${p.link}" class="card-link">Read more</a>
                            </div>
                            <div class="card-footer text-muted">
                                ${new Date(p.pubDate).toLocaleDateString()}
                            </div>
                            <div><span class="pb-3 mb-0 small lh-sm c-777">Author: <br/> ${p.author}</span></div>
                        </div>
                    </div>
                `;
                articles.push(nist);
            });
            document.getElementById('contentPage').innerHTML = `<div class="row">${articles.join('')}</div>`;
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        document.getElementById('news-container').innerText = 'Error fetching news';
    }
}

async function fetchDocuments(url) {
    const container = document.getElementById('contentPage');
    container.innerHTML = "";
    await fetchServer(url)
        .then(json => {
            const docs = [];
            
            json.forEach(doc => {
                
                docs.push(`<div class="col-sm-12 col-md-6 col-lg-6 mb-5">
                                <div class="container d-flex flex-column p-4 mt-3 m-1 card-article dark-shadow">
                                    <div class="row">
                                        <div class="col-4">
                                            <object type="image/svg+xml" data="${doc.icon}" alt="${doc.name}">
                                                Your browser does not support SVG.
                                            </object>
                                        </div>
                                        <div class="col-8">
                                            <span class="pb-3 mb-0 fs-4 lh-sm">${doc.name}</span>                                      
                                        </div>
                                    </div>
                                    <div class="row mt-auto">
                                        <p class="pb-3 mb-0 small lh-sm card-bottom text-justify">${doc.description}</p> 
                                    </div>
                                    <div class="row mt-auto">
                                        <div class="col-sm-12 col-md-6 col-lg-6">
                                            <div><span class="pb-3 mb-0 small lh-sm c-777">Created by: <br/> ${doc.creator}</span></div>
                                        </div>
                                        <div class="col-sm-12 col-md-6 col-lg-6">
                                            <a class="card-link" href="${doc.url}" target="_blank">
                                                <span>view document</span>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>`);
            });
            document.getElementById('contentPage').innerHTML = `<div class="row">${docs.join('')}</div>`;
        })
}

async function fetchTrainings(url) {
    const container = document.getElementById('contentPage');
    container.innerHTML = "";
    await fetchServer(url)
        .then(json => {
            const trainings = [];
            
            json.forEach(trn => {
                
                trainings.push(`<div class="col-sm-12 col-md-6 col-lg-6 mb-5">
                                <div class="container d-flex flex-column p-4 mt-3 m-1 card-article dark-shadow">
                                    <div class="row">
                                        <div class="col-4">
                                            <img src="${trn.image}" />
                                        </div>
                                        <div class="col-8">
                                            <span class="pb-3 mb-0 fs-4 lh-sm">${trn.name}</span>                                      
                                        </div>
                                    </div>
                                    <div class="row mt-auto">
                                        <p class="pb-3 mb-0 small lh-sm card-bottom text-justify">${trn.description}</p> 
                                    </div>
                                    <div class="row mt-auto">${getContentMedia(trn.connect)}</div>
                                    <div class="row mt-auto">
                                        <a class="card-link" href="${trn.url}" target="_blank">
                                            <span>view page</span>
                                        </a>
                                    </div>
                                </div>
                            </div>`);
            });
            document.getElementById('contentPage').innerHTML = `<div class="row">${trainings.join('')}</div>`;
        })
}

async function fetchChannels(url) {
    const container = document.getElementById('contentPage');
    container.innerHTML = "";
    await fetchServer(url)
        .then(json => {
            const channels = []; // container d-flex dark-shadow radius
            json.forEach(channel => {
                channels.push(` <div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 mb-3">
                                    <div class="container mt-3 d-flex dark-shadow radius">
                                        <div class="col-sm-4 col-md-2 col-lg-2">
                                            <img style="width: 75%; border-radius: 50%;" src="${channel.image}">
                                        </div>
                                        <div class="col-sm-6 col-md-10 col-lg-10">
                                            <span>${getYoutubeIcon(channel.url)}${channel.name}</span>
                                            <div><span class="pb-3 mb-0 small lh-sm c-777">Author: ${channel.creator}</span></div>
                                        </div>
                                    </div>
                                </div>`)
            });
            document.getElementById('contentPage').innerHTML = `<div class="row">${channels.join('')}</div>`;
        });
}

async function fetchOrgs(url) {
    const container = document.getElementById('contentPage');
    container.innerHTML = "";
    await fetchServer(url)
        .then(json => {
            const tools = [];
            
            json.forEach(org => {
                tools.push(`<div class="col-sm-12 col-md-4 col-lg-4 mb-5">
                                <div class="container d-flex flex-column p-4 mt-3 m-1 card-article dark-shadow">
                                    <div class="row mt-auto">
                                        <img style="width: 100px; margin: 0 auto;" src="${org.image}" />
                                    </div>
                                    <div class="row mt-auto">
                                        <span class="pb-3 mb-0 small lh-sm">${org.name}</span>                                                                                           
                                    </div>
                                    <div class="row mt-auto">${getContentMedia(org.connect)}</div>
                                    <div class="row mt-auto">
                                        <a class="card-link" href="${org.url}" target="_blank">
                                            <span>Official Page</span>
                                        </a>
                                    </div>
                                </div>
                            </div>`);
            });
            document.getElementById('contentPage').innerHTML = `<div class="row">${tools.join('')}</div>`;
        })
}

async function fetchWiki(url) {
    const container = document.getElementById('contentPage');
    container.innerHTML = "";

    const searchBox = document.createElement('div');
    searchBox.id = "searchBox";
    searchBox.innerHTML =  `<div class="input-group input-group-sm mt-4 mb-4">
                                <div class="input-group bg-dark">
                                    <div class="input-group-text bg-dark">
                                        <input class="form-check-input mt-0 ccc radio" name="options" type="radio" value="Keywords" aria-label="Radio button for following text input"> <label for="Keywords" class="p-1 ccc"> Keywords </label>
                                        <input class="form-check-input mt-0 ccc radio" name="options" type="radio" value="Name" aria-label="Radio button for following text input"> <label for="Name" class="p-1 ccc"> Name </label>
                                        <input checked class="form-check-input mt-0 ccc radio" name="options" type="radio" value="Description" aria-label="Radio button for following text input"> <label for="Definition" class="p-1 ccc"> Definition </label>
                                    </div>
                                    <input type="text" class="form-control bg-dark ccc" onkeydown="search()" max-length="50" aria-label="Text input with radio button">
                                </div>
                            </div>`;

    container.appendChild(searchBox);

    let containerTable = document.createElement("div");
    containerTable.classList.add('container');
    containerTable.classList.add('table-responsive');

    let table = document.createElement("table");
    table.classList.add('ctable');
    /*table.classList.add('table-responsive');
    table.classList.add('table-dark');
    table.classList.add('table-striped');
    table.classList.add('table-hover');*/
    table.id = "table-wiki";
    table.innerHTML += `
                <thead>
                    <tr>
                        <th>Keywords</th>
                        <th>Name</th>
                        <th>Definition</th>
                        <th>References</th>
                    </tr>
                </thead>`;

    let tbody = document.createElement("tbody");

    await fetchServer(url)
        .then(json => {
            //let newjson = "";
            json.sort((a, b) => a.Name.localeCompare(b.Name));
            json.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<tr>
                        <td>${item.Keywords}</td>
                        <td>${item.Name}</td>
                        <td>${item.Definition}</td>
                        <td>${item.References}</td>
                    </tr>`
                tbody.appendChild(tr);
                dataWiki.push(tr);

                /*newjson += `{
                                "Keywords": "${item.Keywords} | ${item.second}",
                                "Name": "${item.Name}",
                                "Definition": "${item.Definition}",
                                "References": "${item.Reference || ""}"
                            },`;*/
            });

            /*debugger;
            console.log(newjson);
            localStorage.setItem("data", newjson);*/
            
            table.appendChild(tbody);
            containerTable.appendChild(table);
            container.appendChild(containerTable);
        });
}

async function fetchAbbrv(url) {
    const container = document.getElementById('contentPage');
    container.innerHTML = "";

    const searchBox = document.createElement('div');
    searchBox.id = "searchBox";
    searchBox.innerHTML =  `<div class="input-group input-group-sm mt-3 mb-3">                                            
                                <input type="text" class="form-control bg-dark ccc" onkeydown="searchAbbrv()" max-length="50" />
                            </div>`;

    container.appendChild(searchBox);

    let table = document.createElement("table");
    table.classList.add('ctable');
    table.id = "table-abbrevs";
    table.innerHTML += `
                <thead>
                    <tr>
                        <th>Abbreviation</th>
                        <th>Text</th>
                    </tr>
                </thead>`;

    let tbody = document.createElement("tbody");

    await fetchServer(url)
        .then(json => {
            json.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `<tr>
                        <td>${item.abbreviation}</td>
                        <td>${item.value}</td>
                    </tr>`
                tbody.appendChild(tr);
                dataAbbrv.push(tr);
            });
            
            table.appendChild(tbody);
            container.appendChild(table);
        });
}

async function fetchMain() {
    await fetchMarkdown('./content/wiki/home.md');
}

async function fetchPathway(url) {
    await fetchServer(url)
        .then(json => {
            const title = `<div class="container"> 
                                <h1>${json.title}</h1>
                                <p class="pb-3 mb-0 small lh-sm">${json.description}</p>
                                <p class="last-updated"> ${new Date()} </p>
                            </div><hr/>`;
            document.getElementById('contentPage').innerHTML = `${title} ${json.content}`;
        })
}

async function fetchPractice(url) {
    await fetchServer(url)
        .then(json => {
            const tools = [];
            const title = `<div class="container"> 
                                <h1>${json.title}</h1>
                                <p class="pb-3 mb-0 small lh-sm">${json.description}</p>
                                <p class="last-updated"> ${new Date()} </p>
                            </div><hr/>`;
            json.tools.forEach(tool => {
                tools.push(`<article class="col-md-4 pt-3 pb-3 border-bottom">
                                <div class="">
                                    <img src="${tool.image}" />
                                    <h3><span class="text-break">${tool.name}</span></h3>                                                                                             
                                </div>
                                <div><span class="pb-3 mb-0 small lh-sm">${tool.description}</span></div>
                                <a class="card-link" href="${tool.url}" target="_blank">
                                    <span>View page</span>
                                </a>
                            </article>`);
            });
            document.getElementById('contentPage').innerHTML = `<div class="row">${title} ${tools.join('')}</div>`;
        })
}

async function fetchTools(url) {
    await fetchServer(url)
        .then(json => {
            const tools = [];
            const title = `<div class="container"> 
                                <h1>${json.title}</h1>
                                <p class="pb-3 mb-0 small lh-sm text-break">${json.description}</p>
                                <p class="last-updated"> ${new Date()} </p>
                            </div><hr/>`;
            json.tools.forEach(tool => {
                tools.push(`<article class="col-md-6 pb-3 pt-3 border-bottom">
                                <div>
                                    <img src="${tool.image}" />
                                    <h3><span class="text-break">${tool.name}</span></h3>                                                                                             
                                </div>
                                <div><span class="pb-3 mb-0 small lh-sm">${tool.description}</span></div>
                                <a class="card-link" href="${tool.url}" target="_blank">
                                    <span>View page</span>
                                </a>
                            </article>`);
            });
            document.getElementById('contentPage').innerHTML = '';
            document.getElementById('contentPage').innerHTML = `<div class="row">${title} ${tools.join('')}</div>`;
        })
}

async function fetchMags(url) {
    await fetchServer('./content/magazines/magazines.json')
        .then(json => {
            const mags = [];
            const title = `<div class="container"> 
                <h1>${json.title}</h1>
                <p class="pb-3 mb-0 small lh-sm card-bottom">${json.description}</p>
                <p class="last-updated"> ${new Date()} </p>
            </div>`;
            json.magazines.forEach(mag => {
                mags.push(`<!-- ${mag.name} -->
                    <div class="col-md-4 mb-4 border-top">
                        <div class="d-flex text-body-secondary pt-3">
                            <div class="card-container">
                                <h4 class="card-title">${mag.name}</h4>
                                <p class="pb-3 mb-0 small lh-sm card-bottom">${mag.description}</p>
                                <a href="${mag.url}" class="card-link" target="_blank">Visit Website</a>
                            </div>
                        </div>
                    </div>`);
            document.getElementById('contentPage').innerHTML = `<div class="row">${title} ${mags.join('')}</div>`;
        });
    });
}

async function fetchServer(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching news:', error);
            document.getElementById('news-container').innerText = 'Error fetching news';
        }
    }

async function fetchMarkdown(url) {
    fetch(url)
        .then(response => response.text())
        .then(markdown => {
            const html = marked.parse(markdown);
            document.getElementById('contentPage').innerHTML = html; 
        })
        .catch(error => console.error('Error loading Markdown file:', error));
}

async function fetchHtml(url) {
    await fetchServer(url)
        .then(response => {
            document.getElementById('contentPage').innerHTML = response.content; 
        })
        .catch(error => console.error('Error loading Markdown file:', error));
}

async function search() {
    debugger
    if (this.event.keyCode == 13) {
        const criteria = this.event.target.value;
        const table = document.getElementById("table-wiki");
        await deleteRows(table)
        .then(_ => {
            let results = [];
            switch(getCheckedValue()) {
                case "Keywords":
                    results = getNewDataWiki(0, criteria);
                    break;
                case "Name":
                    results = getNewDataWiki(1, criteria);
                    break;
                case "Definition":
                default:
                    results = getNewDataWiki(2, criteria);
                    break;
            }
            let tbody = document.createElement("tbody");
            results.forEach(tr => tbody.appendChild(tr));
            table.appendChild(tbody);
        })
    }
}

async function searchAbbrv() {
    const criteria = this.event.target.value;
    const table = document.getElementById("table-abbrevs");
    await deleteRows(table)
    .then(_ => {
        let results = getNewDataAbbrv(criteria);
        let tbody = document.createElement("tbody");
        results.forEach(tr => tbody.appendChild(tr));
        table.appendChild(tbody);
    })
}

function getContentMedia(connect) {
    if (!connect) return `<span style="color:#585959 !important">No Media</span>`;
    let btnGroup = `<div class="btn-toolbar">`;
    const buttons = [];
    connect.forEach(c => {
        buttons.push(`${getIcon(c.tag, c.url)}`);
    });
    btnGroup += `${buttons.join('')} </div>`;
    return btnGroup;
}

function hasItem(x, criteria) {
    return x.includes(criteria) == true;
}

function getNewDataWiki(index, criteria) {
    return dataWiki.filter(x => hasItem(x.cells[index].innerText.toLowerCase(), criteria.toLowerCase()));
}

function getNewDataAbbrv(criteria) {
    return dataAbbrv.filter(x => hasItem(x.cells[0].innerText.toLowerCase(), criteria.toLowerCase()));
}

function getCheckedValue() {
    var radios = document.getElementsByName("options");
    for( i = 0; i < radios.length; i++) {
        if(radios[i].checked) {
            return radios[i].value;
        }
    }
    return null;
}

async function deleteRows(table) {
    let count = table.rows.length;
    for (let i = count-1; i > 0; i--) {
        table.deleteRow(i);
        count = table.rows.length;
    }
}

function getIcon(icon, url) {
    switch(icon) {
        case "fb":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- facebook -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-facebook" viewBox="0 0 16 16">
                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951"></path>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "ig":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- instagram -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "yt":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- youtube -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-youtube" viewBox="0 0 16 16">
                            <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`
        case "tw":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- twitter -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-twitter" viewBox="0 0 16 16">
                            <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "rss":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- rss -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-rss" viewBox="0 0 16 16">
                            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                            <path d="M5.5 12a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m-3-8.5a1 1 0 0 1 1-1c5.523 0 10 4.477 10 10a1 1 0 1 1-2 0 8 8 0 0 0-8-8 1 1 0 0 1-1-1m0 4a1 1 0 0 1 1-1 6 6 0 0 1 6 6 1 1 0 1 1-2 0 4 4 0 0 0-4-4 1 1 0 0 1-1-1"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "in":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- linkedin -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-linkedin" viewBox="0 0 16 16">
                            <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;  
        case "sptfy":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- spotify -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-spotify" viewBox="0 0 16 16">
                            <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0m3.669 11.538a.5.5 0 0 1-.686.165c-1.879-1.147-4.243-1.407-7.028-.77a.499.499 0 0 1-.222-.973c3.048-.696 5.662-.397 7.77.892a.5.5 0 0 1 .166.686m.979-2.178a.624.624 0 0 1-.858.205c-2.15-1.321-5.428-1.704-7.972-.932a.625.625 0 0 1-.362-1.194c2.905-.881 6.517-.454 8.986 1.063a.624.624 0 0 1 .206.858m.084-2.268C10.154 5.56 5.9 5.419 3.438 6.166a.748.748 0 1 1-.434-1.432c2.825-.857 7.523-.692 10.492 1.07a.747.747 0 1 1-.764 1.288"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "threads":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- threads -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-threads-fill" viewBox="0 0 16 16">
                            <path d="M6.81 9.204c0-.41.197-1.062 1.727-1.062.469 0 .758.034 1.146.121-.124 1.606-.91 1.818-1.674 1.818-.418 0-1.2-.218-1.2-.877Z"/>
                            <path d="M2.59 16h10.82A2.59 2.59 0 0 0 16 13.41V2.59A2.59 2.59 0 0 0 13.41 0H2.59A2.59 2.59 0 0 0 0 2.59v10.82A2.59 2.59 0 0 0 2.59 16M5.866 5.91c.567-.81 1.315-1.126 2.35-1.126.73 0 1.351.246 1.795.711.443.466.696 1.132.754 1.983q.368.154.678.363c.832.559 1.29 1.395 1.29 2.353 0 2.037-1.67 3.806-4.692 3.806-2.595 0-5.291-1.51-5.291-6.004C2.75 3.526 5.361 2 8.033 2c1.234 0 4.129.182 5.217 3.777l-1.02.264c-.842-2.56-2.607-2.968-4.224-2.968-2.675 0-4.187 1.628-4.187 5.093 0 3.107 1.69 4.757 4.222 4.757 2.083 0 3.636-1.082 3.636-2.667 0-1.079-.906-1.595-.953-1.595-.177.925-.651 2.482-2.733 2.482-1.213 0-2.26-.838-2.26-1.936 0-1.568 1.488-2.136 2.663-2.136.44 0 .97.03 1.247.086 0-.478-.404-1.296-1.426-1.296-.911 0-1.16.288-1.45.624l-.024.027c-.202-.135-.875-.601-.875-.601Z"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "xing":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- xing -->
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
                            <path d="M162.7 210c-1.8 3.3-25.2 44.4-70.1 123.5-4.9 8.3-10.8 12.5-17.7 12.5H9.8c-7.7 0-12.1-7.5-8.5-14.4l69-121.3c.2 0 .2-.1 0-.3l-43.9-75.6c-4.3-7.8 .3-14.1 8.5-14.1H100c7.3 0 13.3 4.1 18 12.2l44.7 77.5zM382.6 46.1l-144 253v.3L330.2 466c3.9 7.1 .2 14.1-8.5 14.1h-65.2c-7.6 0-13.6-4-18-12.2l-92.4-168.5c3.3-5.8 51.5-90.8 144.8-255.2 4.6-8.1 10.4-12.2 17.5-12.2h65.7c8 0 12.3 6.7 8.5 14.1z"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "discord":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- discord -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-discord" viewBox="0 0 16 16">
                            <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "meetup":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- meetup -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi" viewBox="0 0 24 24">
                            <path d="M6.9805.5547a.518.518 0 00-.1055.0117c-.2873.0619-.4704.3437-.4082.6309.0619.2868.344.47.6309.4082a.5327.5327 0 00.4082-.6328c-.0542-.251-.2782-.4206-.5254-.418zm6.455.6387a.9836.9836 0 00-.5136.1425c-.4698.2818-.6237.8898-.3418 1.3594.2822.4696.8919.6216 1.3613.3399.4698-.2821.6217-.8901.3399-1.3594a.9919.9919 0 00-.8458-.4824zm-3.0292 2.2363c-.9744.0047-1.9565.292-2.8204.8887-.8745.6041-1.4965 1.436-1.8476 2.3593-.5085.0689-1.0096.239-1.461.5508-1.4918 1.0307-1.886 3.0391-.9394 4.5625-1.2846 1.1762-1.5815 3.1356-.6055 4.6485.579.897 1.4882 1.437 2.4649 1.5976.018.732.238 1.466.6855 2.1133 1.224 1.7709 3.6526 2.2157 5.4238.9922.0677-.047.1198-.1061.1836-.1563.9872.8809 2.4708 1.0255 3.6075.2403.6065-.4189.9929-1.0292 1.162-1.6914.8895.0326 1.7956-.1935 2.584-.7383 1.8916-1.3067 2.3995-3.8615 1.1895-5.789.9713-.819 1.1798-2.2514.4336-3.3087-.3327-.4718-.8028-.7806-1.3164-.9336.0752-.984-.1704-1.9979-.7754-2.873-1.1792-1.7058-3.3327-2.3315-5.1953-1.6563a5.1058 5.1058 0 00-2.7735-.8066zm-5.6036.8164a.7589.7589 0 00-.4238.1348c-.3447.2383-.4317.7097-.1934 1.0546.2384.3447.7116.4317 1.0567.1934a.7574.7574 0 00.1933-1.0547.7581.7581 0 00-.6328-.3281zM20.797 6.617a.8419.8419 0 00-.4707.1505.8453.8453 0 101.1758.2148.8452.8452 0 00-.7051-.3652zm-8.1504 1.0274c.0629.0004.1244.0053.1816.0137.2286.0336.3655.119.4512.1875.1682.1342.2726.2412.4316.3926.2394.2275.4132.089.5332.0195.208-.1209.3692-.2181.9844-.207.6332.011 1.3626.2366 1.5137 1.3164.1682 1.1994-1.9656 4.2891-1.8164 5.7226.1054 1.0103 1.8146.2987 1.959 1.2207.1872 1.197-2.1353.752-2.666.4922-.832-.4077-1.337-1.3399-1.1211-2.2597.1612-.6882 1.7-3.4979 1.7578-3.9297.0587-.4404-.1773-.477-.3242-.4844-.1895-.0098-.3394.0808-.5254.3613-.1692.2558-2.082 4.0856-2.248 4.3985-.2969.5594-.6698.6938-1.045.6738-.5472-.0285-.7978-.3206-.7188-.8477.0467-.31 1.2594-3.0491 1.3223-3.4765.0387-.2643-.0132-.5452-.2754-.6797-.2625-.1346-.5713.0704-.664.2266-.128.2154-1.8482 4.7065-2.0313 5.039-.3168.576-.6508.7594-1.1523.7832-1.1862.0562-2.0656-.919-1.6778-2.1152.173-.5328 1.3159-4.5716 1.8946-5.5996C7.799 8.2015 8.8782 7.676 9.627 8c.3878.1679.9252.4377 1.084.5078.366.1622.7594-.2776.914-.4121.1549-.1345.3017-.2765.4902-.3574.1412-.0605.3426-.0947.5313-.0938zm10.8808 2.0567a.4683.4683 0 00-.0937.0117.4671.4671 0 00-.3594.5547.4696.4696 0 00.5567.3594c.2523-.0546.414-.3044.3593-.5567a.4696.4696 0 00-.4629-.3691zm-22.5195.8105a.9972.9972 0 00-.832.4336c-.3123.4553-.1977 1.0784.2578 1.3906.4555.3123 1.0783.1956 1.3906-.2597s.1977-1.0765-.2578-1.3887a.9992.9992 0 00-.5586-.1758zm21.295 2.0938a.635.635 0 00-.127.0136.6268.6268 0 00-.4805.7461.6278.6278 0 00.7461.4825c.3393-.0733.5558-.407.4824-.7461a.6295.6295 0 00-.621-.4961zM4.0624 18.703a.453.453 0 00-.0918.0117c-.2507.0543-.4117.3018-.3574.5528.054.251.302.4097.5527.3554a.4644.4644 0 00.3555-.5527.4655.4655 0 00-.459-.3672zm13.6758 1.5508a1.0444 1.0444 0 00-.584.1856c-.4758.3287-.5945.9813-.2656 1.457.3288.4756.9809.5943 1.457.2656.4758-.3287.5945-.9814.2656-1.457a1.0444 1.0444 0 00-.873-.4512zm-6.338 1.9004a.6427.6427 0 00-.3593.1152.6456.6456 0 00-.164.8985.6457.6457 0 00.8984.164.6456.6456 0 00.164-.8984.646.646 0 00-.539-.2793Z"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "github":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- github -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
        case "subs":
            return `<button type="button" class="btn btn-outline-secondary" onclick="window.open('${url}', '_blank')"> <!-- github -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-mailbox" viewBox="0 0 16 16">
                            <path d="M4 4a3 3 0 0 0-3 3v6h6V7a3 3 0 0 0-3-3m0-1h8a4 4 0 0 1 4 4v6a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V7a4 4 0 0 1 4-4m2.646 1A4 4 0 0 1 8 7v6h7V7a3 3 0 0 0-3-3z"/>
                            <path d="M11.793 8.5H9v-1h5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.354-.146zM5 7c0 .552-.448 0-1 0s-1 .552-1 0a1 1 0 0 1 2 0"/>
                        </svg>
                        <span class="visually-hidden">Button</span>
                    </button>`;
    }
}

function getYoutubeIcon(url) {
    return `<a href="${url}" target="_blank">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" class="bi bi-youtube" viewBox="0 0 16 16">
                    <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.01 2.01 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.01 2.01 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31 31 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.01 2.01 0 0 1 1.415-1.42c.487-.13 1.544-.21 2.654-.26l.17-.007.172-.006.086-.003.171-.007A100 100 0 0 1 7.858 2zM6.4 5.209v4.818l4.157-2.408z"/>
                </svg>
            </a>`;
}

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

window.addEventListener('scroll', function() {
    let stickyDiv = document.getElementById('stickyDiv');

    if (stickyDiv){
        let stickyTop = stickyDiv?.offsetTop;

        if (window.pageYOffset >= stickyTop - 20) { // Adjust based on `top` value
            stickyDiv.classList.add('sticky-active');
        } else {
            stickyDiv.classList.remove('sticky-active');
        }
    }
});
