import React, { useEffect, useState } from 'react';
import { FaHeadset, FaStar } from 'react-icons/fa';
import {
  FiPlus,
  FiMinus,
  FiMessageCircle,
  FiMail,
  FiPhone,
} from 'react-icons/fi';
import { MdOutlineQuestionAnswer } from 'react-icons/md';

const AboutsUs = () => {
  const [faqs, setFaqs] = useState([]);
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    fetch('/faq.json')
      .then(res => res.json())
      .then(data => setFaqs(data));
  }, []);

  const toggleFaq = index => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section badge */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex items-center gap-2 bg-orange-500/15 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full">
            <MdOutlineQuestionAnswer size={13} />
            Frequently Asked Questions
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* LEFT — Support card */}
          <div className="lg:col-span-1 flex flex-col gap-5">
            {/* Main support card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-7 hover:border-orange-400/30 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-400 rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-orange-500/20">
                <FaHeadset size={22} className="text-white" />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Got{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                  Questions?
                </span>
              </h2>
              <p className="text-white font-semibold mt-1">We've Got Answers</p>

              <p className="mt-3 text-blue-300/60 text-sm leading-relaxed">
                We're always here to help you with booking, payment and travel
                support — 24/7.
              </p>

              {/* Stats */}
              <div className="flex gap-4 mt-5 pt-5 border-t border-white/8">
                <div className="text-center">
                  <p className="text-orange-400 font-bold text-lg leading-none">
                    24/7
                  </p>
                  <p className="text-blue-300/50 text-[10px] mt-0.5">Support</p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center">
                  <p className="text-orange-400 font-bold text-lg leading-none">
                    {'<2min'}
                  </p>
                  <p className="text-blue-300/50 text-[10px] mt-0.5">
                    Response
                  </p>
                </div>
                <div className="w-px bg-white/10" />
                <div className="text-center flex items-center gap-1">
                  <p className="text-orange-400 font-bold text-lg leading-none">
                    4.9
                  </p>
                  <FaStar size={10} className="text-orange-400 mb-0.5" />
                  <p className="text-blue-300/50 text-[10px] mt-0.5 ml-0.5">
                    Rating
                  </p>
                </div>
              </div>

              <a
                href="/contact"
                className="inline-flex items-center gap-2 mt-5 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-yellow-400 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-orange-500/25 hover:-translate-y-0.5"
              >
                <FiMessageCircle size={15} />
                Contact Us
              </a>
            </div>

            {/* Contact options */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <a
                href="mailto:support@voyago.com"
                className="flex items-center gap-3 hover:bg-white/5 rounded-xl px-2 py-2 transition-colors group"
              >
                <div className="w-8 h-8 bg-blue-500/15 border border-blue-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiMail size={14} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">
                    Email Support
                  </p>
                  <p className="text-blue-300/50 text-[10px]">
                    support@voyago.com
                  </p>
                </div>
              </a>
              <div className="border-t border-white/8" />
              <a
                href="tel:+8801781540625"
                className="flex items-center gap-3 hover:bg-white/5 rounded-xl px-2 py-2 transition-colors group"
              >
                <div className="w-8 h-8 bg-emerald-500/15 border border-emerald-400/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FiPhone size={14} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">
                    Phone Support
                  </p>
                  <p className="text-blue-300/50 text-[10px]">
                    +880 178 154 0625
                  </p>
                </div>
              </a>
            </div>
          </div>

          {/* RIGHT — FAQ accordion */}
          <div className="lg:col-span-2 space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  openIndex === index
                    ? 'bg-white/8 border-orange-400/30'
                    : 'bg-white/4 border-white/8 hover:border-white/15 hover:bg-white/6'
                }`}
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center text-left px-5 py-4 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors ${
                        openIndex === index
                          ? 'bg-orange-500 text-white'
                          : 'bg-white/10 text-blue-300/60'
                      }`}
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h4
                      className={`text-sm font-semibold transition-colors ${
                        openIndex === index ? 'text-white' : 'text-blue-100/80'
                      }`}
                    >
                      {faq.question}
                    </h4>
                  </div>

                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                      openIndex === index
                        ? 'bg-orange-500 text-white rotate-0'
                        : 'bg-white/8 text-blue-300/60'
                    }`}
                  >
                    {openIndex === index ? (
                      <FiMinus size={13} />
                    ) : (
                      <FiPlus size={13} />
                    )}
                  </div>
                </button>

                {openIndex === index && (
                  <div className="px-5 pb-4 pl-14">
                    <p className="text-blue-200/65 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutsUs;
