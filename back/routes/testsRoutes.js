module.exports = (req, res) => {
    const url = req.url;
    const method = req.method;

    if(url === "/tests" && method === "GET"){
        res.writeHead(200, {"Content-Type": "application/json"});
        res.end(JSON.stringify({message: "Route de test"}));
    }
    else{
        res.writeHead(404, {"Content-Type": "application/json"});
        res.end(JSON.stringify({error: "Route utilisateur non trouvée"}));
    }
}