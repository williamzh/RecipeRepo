$repoDir = 'D:\GitRepos\RecipeRepo'
$esDir = 'C:\Program` Files\ElasticSearch\elasticsearch-1.2.2\bin'

# Start up front Elastic Search
Start-Process powershell -verb runAs -ArgumentList ($esDir + '\elasticsearch.bat')

# Start up backend server (API)
Start-Process powershell -ArgumentList ('node "' + $repoDir + '\Backend\server.js"')

# Start up frontend server (Angular app)
Start-Process powershell -ArgumentList ('node "' + $repoDir + '\Frontend\web-server.js"')