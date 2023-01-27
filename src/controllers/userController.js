import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};

export const postJoin = async (req, res) => {
  const { name, email, username, password, password2, location } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "Password confirmation does not match.",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This email/username is already taken.",
    });
  }
  try {
    await User.create({
      name,
      email,
      username,
      password,
      location,
    });
    res.redirect("/login");
  } catch (error) {
    return res
      .status(400)
      .render("join", { pageTitle: "Join", errorMessage: error.message });
  }
};

export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username does not exists.",
    });
  }
  if (user.socialOnly === true) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with this username is joined by Social Login.",
    });
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong password.",
    });
  }
  req.session.loggedIn = true;
  req.session.user = user;
  console.log("login success! welcome.");
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: { Accept: "application/json" },
    })
  ).json();
  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const userData = await (
      await fetch("https://api.github.com/user", {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch("https://api.github.com/user/emails", {
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      const existingUsername = await User.findOne({ username: userData.login });
      user = await User.create({
        name: userData.name,
        email: emailObj.email,
        username: existingUsername
          ? userData.login + Math.ceil(Math.random() * 9)
          : userData.login,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    console.log("login success! welcome.");
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};

export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { name, email, username, location },
    file,
  } = req;
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      name,
      email,
      username,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly) {
    res.redirect("/");
  }
  return res.render("change-password", { pageTitle: "Change Password" });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;
  const user = await User.findById(_id);
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The current password is incorrect.",
    });
  }
  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render("change-password", {
      pageTitle: "Change Password",
      errorMessage: "The password does not match the confirmation.",
    });
  }
  user.password = newPassword;
  await user.save();
  return res.redirect("/users/logout");
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const see = (req, res) => res.send("Watch");
