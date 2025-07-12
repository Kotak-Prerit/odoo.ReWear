import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: { username: "", email: "", password: "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Required"),
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().min(6, "Password too short").required("Required"),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const res = await axios.post("/api/users/register", values);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data));
        navigate("/dashboard");
      } catch (err: unknown) {
        setErrors({ email: "Registration failed" });
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse: { credential?: string }) => {
    try {
      if (!credentialResponse.credential) return;
      
      const res = await axios.post("/api/users/google-login", {
        token: credentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate("/dashboard");
    } catch {
      // Handle error
    }
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="flex bg-white items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8">
        <div className="xl:mx-auto xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center" />
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="font-medium text-black hover:underline"
            >
              Sign in here
            </Link>
          </p>
          <form className="mt-8" onSubmit={formik.handleSubmit}>
            <div className="space-y-5">
              <div>
                <label
                  htmlFor="username"
                  className="text-base font-medium text-gray-900"
                >
                  Username
                </label>
                <div className="mt-2">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Enter your username"
                    onChange={formik.handleChange}
                    value={formik.values.username}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  {formik.errors.username && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="text-base font-medium text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    onChange={formik.handleChange}
                    value={formik.values.email}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  {formik.errors.email && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="text-base font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    onChange={formik.handleChange}
                    value={formik.values.password}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  {formik.errors.password && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                  )}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  disabled={formik.isSubmitting}
                >
                  {formik.isSubmitting ? "Creating account..." : "Create account"}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-3 space-y-3">
            <div className="flex justify-center">
              <GoogleLogin 
                onSuccess={handleGoogleSuccess} 
                onError={() => {}}
                text="signup_with"
                theme="outline"
                size="large"
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
