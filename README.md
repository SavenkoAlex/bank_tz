docker-compose build <br/>
docker-compose up -d <br/>
# И можно проверить curlом <br/>
curl -v "http://localhost:8181/api/category?search=qu&sort=createDate&pageSize=4" <br/>

в случае если контейнер с приложением не подымается <br/>
npm i <br/>
tsc -p . <br/> 
npm run start <br/>
