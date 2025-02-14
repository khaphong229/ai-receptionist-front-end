"use client";

// I WANTED USING ZOD FOR ERROR HANDLING BUT ITS A MINI PROJECT
// PROBABLY NEXT TUTORIAL
import { PiWarningThin } from "react-icons/pi";
import { TbArrowsJoin2 } from "react-icons/tb";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

import {
  AnimatePresence,
  motion,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";

import Snowfall from "react-snowfall";

const people = [
  {
    id: 1,
    name: "JOIN NOW",
    designation: "How bout u join my fuqin waitlist 😂",
    image: "/img/email.png",
    href: "https://instagram.com/Joscriptt ",
  },
];

// useForm
import { useForm, Controller } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// Zod
import { z } from "zod";

// const emailSchema = z.object({
//   email: z.string().email()
//   .min(10, "Email must at least be 5-7 characters long"),
// });

function PageHook() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenModel, setIsOpenModel] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move

  const {
    // register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting, isDirty, isValid },
    reset,
  } = useForm();

  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  );

  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 20]),
    springConfig
  );

  const handleMouseMove = (event) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  const validateEmail = (mail) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailRegex.test(mail);
  };

  const handleOpenModel = () => {
    setIsOpenModel(true);
    setTimeout(() => {
      setIsOpenModel(false);
    }, 4000);
  };

  const onSubmit = async (data) => {
    try {
      let res = await fetch("/api/email", {
        method: "POST",
        body: JSON.stringify(data.email),
      });
      if (res.ok) {
        reset();
        handleOpenModel();
      }

      if (!res.ok) {
        reset();
        throw new Error({ message: "Email already exists" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full w-full p-3 flex items-center justify-center relative z-50">
      <Snowfall
        snowflakeCount={200}
        color="grey"
        style={{
          position: "fixed",
          width: "100vw",
          height: "100vh",
          zIndex: -9,
        }}
        speed={"140"}
        radius={"12"}
      />
      <section className=" mt-5  ">
        <div className="space-y-4 ">
          <div className="space-y-2 text-center">
            <div className="flex justify-center">
              {/* You can use video here as well */}
              <Image
                width={128}
                height={128}
                alt="shake head"
                src={"/img/recep.gif"}
                className="w-32"
              />
            </div>
            <div className="flex items-center justify-center">
              <span>🚀</span>
              <div className="p-[1px] bg-transparent  relative">
                <div className="p-2 ">
                  <span className="absolute inset-0 px-3 rounded-3xl overflow-hidden">
                    <motion.span
                      className="w-[500%] aspect-square absolute bg-[conic-gradient(from_0deg,transparent_0_340deg,white_360deg)] opacity-20"
                      initial={{
                        rotate: -90,
                      }}
                      animate={{
                        rotate: 90,
                      }}
                      transition={{
                        duration: 3.8,
                        ease: "linear",
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                      style={{
                        translateX: "-50%",
                        translateY: "-10%",
                        zIndex: -1,
                      }}
                    />
                  </span>
                  <span className="bg-clip-text text-transparent dark:bg-gradient-to-r bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-700">
                    Innovative, Efficient, Engaging
                  </span>
                </div>
              </div>
              {/* <p className="bg-clip-text text-transparent dark:bg-gradient-to-r bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-800">
                Amazing Framer Templates & Resources!
              </p> */}
            </div>
            <h1 className="text-3xl font-bold  sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent dark:bg-gradient-to-r bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-800 capitalize md:max-w-2xl lg:max-w-3xl mx-auto ">
              Lysia - AI Receptionist Restaurant
            </h1>
            <p className="max-w-[600px]  leading-7 text-center text-[16px] bg-clip-text text-transparent dark:bg-gradient-to-br bg-gradient-to-tr dark:from-white from-black to-neutral-600 dark:to-neutral-700 mx-auto ">
              Lysia enhances customer service with face recognition, voice
              interaction, and chatbot support. It identifies returning guests,
              assists new customers via OCR, and enables seamless voice-based
              communication for inquiries and reservations.
            </p>
          </div>
          <div className="w-full space-y-2 flex justify-center items-center">
            <button
              disabled={isSubmitting}
              className="flex items-center justify-center gap-x-3 bg-gradient-to-tr from-black from-50% via-black/40 to-gray-600/40 via-45% border-t-gray-700  disabled:cursor-not-allowed lg:w-36 shadow-md  border border-b-0 border-r-0 border-l-0 bg-black  mt-4 lg:mt-0 rounded-md px-2 py-2.5 w-full  font-InterMedium text-sm text-gray-200 dark:text-gray-500 "
              type="submit"
            >
              <TbArrowsJoin2 className="text-neutral-500" />
              <span className="shrink-0 text-neutral-300">Get started</span>
            </button>
          </div>
          <div className="p-3 rounded-lg border dark:border-white/10 border-neutral-400 dark:border-opacity-10 relative top-14 sm:top-14 lg:top-24 max-w-xl mx-auto flex flex-col lg:flex-row justify-between items-center text-sm">
            <p className=" text-zinc-500 dark:text-zinc-100">
              Get ready to redefine your email experience.
            </p>
            <Link
              onClick={() => setIsOpen(true)}
              className=" bg-zinc-700/30 lg:py-1 py-2 px-2 w-full lg:w-fit mt-3 md:mt-3 lg:mt-0 text-center rounded-md  text-white"
              href="/"
            >
              <span>Terms & Conditions</span>
            </Link>
            <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} />
            <RecievedModal
              isOpenModel={isOpenModel}
              setIsOpenModel={setIsOpenModel}
            />
          </div>
        </div>
        {/* {isOpenModel && <p>Submitted</p>} */}
      </section>
    </div>
  );
}

export default PageHook;

const SpringModal = ({ isOpen, setIsOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // onClick={() => setIsOpen(false)}
          className="bg-black/80  p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll "
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.2,
              stiffness: "20",
              type: "just",
              damping: 100,
            }}
            exit={{ scale: 0 }}
            // onClick={(e) => e.stopPropagation()}
            className="bg-white/20 backdrop-blur-lg  border border-white/10 border-opacity-10 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative "
          >
            <Image
              width={100}
              height={100}
              className="w-16 absolute right-0 -top-16"
              src="/img/whisper.png"
              alt="whisper"
            />

            <div className="relative z-10">
              <p className="lg:text-justify  leading-6 mb-6">
                I'm doing a little Giveaway on the Launch of this Template
                Website by December. So If you sign up today, which will only
                take a few seconds and 1 click, you'll automatically be
                participated in our giveaway and 10 lucky people will get free
                access to one of Our Premium Templates, free of cost!
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpen(false)}
                  className=" flex gap-x-3 items-center justify-center lg:justify-start bg-transparent bg-white text-black hover:bg-neutral-300  transition-colors duration-200 dark:text-black font-semibold lg:w-fit w-full py-2 lg:py-1.5 rounded px-8"
                >
                  Got that
                  <Image
                    width={5}
                    height={5}
                    className="w-5"
                    src="/img/alarm.png"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
const RecievedModal = ({ isOpenModel, setIsOpenModel }) => {
  return (
    <AnimatePresence>
      {isOpenModel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // onClick={() => setIsOpen(false)}
          className="bg-black/80  p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll "
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              duration: 0.2,
              stiffness: "20",
              type: "just",
              damping: 100,
            }}
            exit={{ scale: 0 }}
            // onClick={(e) => e.stopPropagation()}
            className="bg-white/20 backdrop-blur-lg  border border-white/10 border-opacity-10 text-white p-6 rounded-lg w-full max-w-md shadow-xl cursor-default relative "
          >
            <Image
              width={100}
              height={100}
              className="w-16 absolute right-0 -top-16"
              src="/img/party.png"
              alt=""
            />
            <h1 className="text-3xl font-InterBold text-center">
              You're on the waitlist
            </h1>

            <div className="relative z-10">
              <p className=" text-center text-lg mt-4  mb-6">
                We'll send a notification as soon as v0 is ready for you to
                experience
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsOpenModel(false)}
                  className=" flex justify-center gap-x-3 items-center bg-transparent bg-white text-black hover:bg-neutral-300  transition-colors duration-200 dark:text-black font-semibold w-60 mx-auto py-2 rounded px-8"
                >
                  <span>Happy Coding</span>
                  <Image
                    width={7}
                    height={7}
                    className="w-7"
                    src="/img/got.png"
                    alt=""
                  />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
