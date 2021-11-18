const inputStatus = {
  email: {
    RegExp:
      /^[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,
    errorMessage: '올바른 아이디 형식을 입력해주세요.',
    duplication: false,
    status: false,
  },
  password: {
    RegExp: /^[A-Za-z0-9]{8,16}$/,
    errorMessage: '영문 또는 숫자를 8-16자 입력해주세요.',
    status: false,
  },
  userName: {
    RegExp: /^[가-힇]{2,10}$/,
    errorMessage: '이름을 2-10자 입력해주세요.',
    status: false,
  },
  nickname: {
    RegExp: /^[\w\Wㄱ-ㅎㅏ-ㅣ가-힣]{2,10}$/,
    errorMessage: '닉네임을 2-10자 입력해주세요.',
    status: false,
  },
  confirmPassword: {
    errorMessage: '패스워드가 일치하지 않습니다.',
    status: false,
  },
  phoneNum: {
    RegExp: /01[016789]-[^0][0-9]{2,3}-[0-9]{3,4}/,
    errorMessage: '핸드폰 번호 형식으로 입력해주세요.',
    status: false,
  },
  profileImage: {
    status: false,
  },
};

const isAbleToSignup = allInputOfForm =>
  [...allInputOfForm].every(inputType => inputStatus[inputType.name].status) &&
  inputStatus.email.duplication;

const isAbleToSignin = allInputOfForm =>
  [...allInputOfForm].every(inputType => inputStatus[inputType.name].status);

const isSamePassword = confirmPassword =>
  confirmPassword === document.getElementById('signupPassword').value;

export { inputStatus, isAbleToSignup, isAbleToSignin, isSamePassword };
