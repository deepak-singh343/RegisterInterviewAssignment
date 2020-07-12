module.exports.homepage = async function (req, res) 
{
    return res.render('sign_up', {
        title: "Register"                       //render title to signup page
    });
}