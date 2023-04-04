let news = [];
let page = 1;
let total_pages = 0;
let menus = document.querySelectorAll(".menu-bar button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);

let searchButton = document.getElementById("search-button");
let url;

//각 함수에서 필요한 url을 만든다
//api호출 함수를 부른다

const getNews = async () => {
  try {
    let header = new Headers({
      "x-api-key": "-HE87_3chlwvt_6MipBTJPoVuplsEf3DflHd6uFVJY4",
    });
    url.searchParams.set("page", page);
    console.log("url은", url);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다");
      }
      console.log("받는 데이터가 뭐지?", data);
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;
      console.log(news);
      render();
      pagination();
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log("에러는", error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10"
  );
  getNews();
};

const getNewsByTopic = async (event) => {
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
  );
  getNews();
};

const searchNews = async () => {
  console.log("click");
  let keyword = document.getElementById("search-input").value;
  console.log(keyword);
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=10`
  );
  getNews();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news">
      <div class="col-lg-4">
        <img
          class="news-img"
          src="${item.media}"
        />
      </div>
      <div class="col-lg-8">
        <h2>${item.title}</h2>
        <p>
          ${
            item.summary == null || item.summary == ""
              ? "내용없음"
              : item.summary.length > 200
              ? item.summary.substring(0, 200) + "..."
              : item.summary
          }</p>
        <div>${item.rights} * ${item.published_date}</div>
      </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
  ${message}
</div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const pagination = () => {
  let paginationHTML = ``;
  if (page > 1) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)">
    <a class="page-link" href='#js-bottom' id='allprev'>&lt;&lt;</a>
  </li>
  <li class="page-item" onclick="moveToPage(${page - 1})">
    <a class="page-link" href='#js-bottom' id='allprev'>&lt;</a>
  </li>`;
  }
  //total_page수
  //현재 어떤 page 보고있는지
  //page group
  let pageGroup = Math.ceil(page / 5);
  //last page
  let last = pageGroup * 5;
  // first page
  let first = last - 4;
  //first~last page 프린트
  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${
      page == i ? "active" : "" //현재 페이지에만 표시
    }"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`;
  }
  if (last < total_pages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
     <a  class="page-link" href='#js-program-detail-bottom'  id='next'>&gt;</a>
    </li>
    <li class="page-item" onclick="moveToPage(${total_pages})">
    <a class="page-link" id='allnext'>&gt;&gt;</a>
    </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  //1. 이동하고 싶은 페이지 알고
  //2. 페이지를 가지고 api 다시 호출
  page = pageNum;
  url = new URL(
    "https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10"
  );
  getNews();
};
searchButton.addEventListener("click", searchNews);
getLatestNews();
