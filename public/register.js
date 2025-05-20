const register = async () => {
  try {
    const data = {
      first_name: document.querySelector("#first_name").value,
      last_name: document.querySelector("#last_name").value,
      email: document.querySelector("#email").value,
      age: parseInt(document.querySelector("#age").value, 10), 
      password: document.querySelector("#password").value,
      role: document.querySelector("#role").value || "user" 
    };

    const opts = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };

    const url = "/api/auth/register";
    let response = await fetch(url, opts);
    response = await response.json();
    
    console.log(response);
    
    if (response.error) {
      alert(response.error);
    } else {
      location.replace("/login");//redirigo al login
    }
  } catch (error) {
    alert(error.message);
  }
};

document.querySelector("#register").addEventListener("click", register);