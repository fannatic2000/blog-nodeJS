function Validator(formSelector, formType) {
    // Lấy ra cha
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    // Chứa các rules lấy ra từ thẻ input
    var formRules = {};

    // Chứa các hàm thực thi các rules
    // Nếu có lỗi return `error message`, nếu KHÔNG return `undifined`
    var validatorRules = {
        required: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này';
        },

        email: function (value) {
            var regex =
                /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập email';
        },

        min: function (min) {
            return function (value) {
                return value.length >= min
                    ? undefined
                    : `Vui lòng nhập ít nhất ${min} kí tự`;
            };
        },

        max: function (max) {
            return function (value) {
                return value.length <= max
                    ? undefined
                    : `Vui lòng nhập tối đa ${max} kí tự`;
            };
        },

        confirmed: function (value) {
            var password = document.querySelector(
                `${formSelector} [name="password"]`,
            ).value;
            return value.trim() === password
                ? undefined
                : 'Không khớp mật khẩu';
        },
    };

    var formElement = document.querySelector(formSelector);

    if (formElement) {
        // Lấy các rules từ thẻ input
        var inputs = formElement.querySelectorAll('[name][rules]');

        // Tách các rules -> Chuyển thành function tương ứng -> Lưu vào formRules{}
        for (var input of inputs) {
            var rules = input.getAttribute('rules').split('|');

            for (var rule of rules) {
                var isRuleHasValue = rule.includes(':');
                var ruleInfo;

                if (isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                var ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            // Lắng nghe các sự kiện để Validate (blur, change,...)
            input.onblur = handleValidate;
            input.oninput = handleClearError;
        }

        // Hàm thực hiện Validate
        function handleValidate(event) {
            var rules = formRules[event.target.name];
            var errorMessage;

            // Tìm lỗi
            for (var i = 0; i < rules.length; i++) {
                // Nếu rule không phải là function (không có trong validatorRules) thì bị bỏ qua.
                if (typeof rules[i] !== 'function') continue;

                switch (event.target.type) {
                    case 'radio':
                    case 'checkbox':
                        errorMessage = rules[i](
                            formElement.querySelector(
                                `[name="${event.target.name}"]:checked`,
                            )
                                ? 'checked'
                                : '',
                        );
                        break;

                    default:
                        errorMessage = rules[i](event.target.value);
                }

                if (errorMessage) break;
            }

            // Nếu có lỗi thì hiển thị message ra UI
            if (errorMessage) {
                var formGroup = getParent(event.target, '.form-group');

                if (formGroup) {
                    formGroup.classList.add('invalid');

                    var formMessage = formGroup.querySelector('.form-message');
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }

            return !errorMessage;
        }

        // Hàm Clear message lỗi
        function handleClearError(event) {
            var formGroup = getParent(event.target, '.form-group');

            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');

                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        }

        // Xử lý khi submit form
        $(formSelector).on('submit', function (event) {
            event.preventDefault();
            var isValid = true;

            var typeCheckReplace = ['radio', 'checkbox'];

            for (var i = 0; i < inputs.length; i++) {
                if (typeCheckReplace.includes(inputs[i].type)) {
                    if (inputs[i].name === inputs[i - 1].name) {
                        continue;
                    }
                }

                if (!handleValidate({ target: inputs[i] })) {
                    isValid = false;
                }
            }

            // Nếu không có lỗi thì submit form
            if (isValid) {
                if (typeof this.onSubmit === 'function') {
                    // Do dùng arrow function nên this lúc này là Validator chứ không phải của onsubmit

                    var enableInputs = formElement.querySelectorAll(
                        '[name]:not([disabled])',
                    );
                    var formValues = Array.from(enableInputs).reduce(function (
                        values,
                        input,
                    ) {
                        switch (input.type) {
                            case 'radio':
                                if (input.checked) {
                                    // input.matches(':checked')
                                    values[input.name] = input.value;
                                }
                                break;
                            case 'checkbox':
                                if (!input.checked) {
                                    if (!Array.isArray(values[input.name])) {
                                        values[input.name] = '';
                                    }
                                    return values;
                                }

                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = [];
                                }

                                values[input.name].push(input.value);

                                break;
                            case 'file':
                                values[input.name] = input.files;
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return values;
                    },
                    {});

                    this.onSubmit(formValues);
                } else {
                    switch (formType) {
                        case 'register':
                            const userNameEle =
                                document.querySelector('#username');
                            $.getJSON(
                                `/account/is-available?username=${userNameEle.value}`,
                                function (isAvailale) {
                                    if (isAvailale) {
                                        console.log($(formSelector));
                                        $(formSelector).off('submit').submit();
                                    } else {
                                        const formMessage =
                                            userNameEle.nextElementSibling;
                                        var formGroup = getParent(
                                            formMessage,
                                            '.form-group',
                                        );
                                        formGroup.classList.add('invalid');
                                        formMessage.innerText =
                                            'Tên người dùng đã được sử dụng. Hãy thử tên khác.';
                                    }
                                },
                            );
                            break;
                        default:
                            formElement.submit();
                            break;
                    }
                }
            }
        });
    }
}
