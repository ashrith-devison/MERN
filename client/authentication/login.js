function validate(){
    const data = {
        username : $('#username').val(),
        password : $('#passkey').val()
    };
    fetch('http://localhost:3000/login',{
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify(data)
    }).then(response => {
        if(!response.ok){
            console.error("Error in Login");
        }
        return response.json();
    }).then(data => {
        Swal.fire({
            title : data.message,
            icon : data.icon,
            showConfirmButton : false,
            timer : 15000
        }).then(() => {
            fetch(data.link).then(response => {
                if(!response.ok){
                    console.error("Error in Loading Home Page");
                }
                return response.text();
            }).then(file => {
                $(document.documentElement).html(file);
            })
        })
    })
    return false;
}