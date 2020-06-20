Util.domLoaded(()=>{

    const button = Util.search('[data-btn]', 'data-btn', '#login');
    const input = Util.search('[data-input]', 'data-input', '#login');
    const ui = Util.search('[data-ui]', 'data-ui', '#login');
    const callAction = location.pathname === "/signin" ? 'signin' : 'register';

    function notValidAimate (text) {
        ui.info.textContent = text || '';
        ui.form.classList.add('anim-shake');
        setTimeout(() => {
            ui.form.classList.remove('anim-shake');
        }, 1000);
    }

    Util.on(button.submit, 'click', (e) => {
        e.preventDefault();

        const data = {
            username: input.username.value,
            password: input.password.value,
        };

        if (callAction === 'register') {

            if (input.passwordConfirm.value !== data.password) {
                return notValidAimate('Repeated password does not match the original!');
            }

            if (Util.validEmail(input.email.value)) {
                data.email = input.email.value;
            } else {
                return notValidAimate('Email address is not valid!');
            }

        }

        if (data.username && data.username.length > 4 &&
            data.password && data.password.length > 4)
        {

            if (!Util.validText(data.username) || !Util.validPassword(data.password)) {
                return notValidAimate('Input fields must be more than 4 characters, Without spaces.');
            }

            Util.httpRequest({
                url: '/' + callAction,
                method: 'post',
                data: data,
            }, (status, response) => {
                if (status === 200) {

                    console.log('response');
                    console.log(status, response);

                    response = JSON.parse(response);
                    if (response.status === "OK") {
                        location.href = '/'
                    } else {
                        notValidAimate(response.message);
                    }
                }
            })

        } else {
            notValidAimate('Input fields are not filled');
        }

    });

});