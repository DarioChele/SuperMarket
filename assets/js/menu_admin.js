document.addEventListener('DOMContentLoaded', function() {    
    if(sessionStorage.getItem('rol_id') != 1){
        window.location.href = '/';
    }
});
