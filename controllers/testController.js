const testControllerGet = (req,res)=>{
    try {
        res.json({"message":"Test Api GET"})
    } catch (error) {
        console.log(error);
    }
}

module.exports = {testControllerGet}