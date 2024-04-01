export default function Menu() {
    return (
        <nav className="main-menu">
          <div className="menu py-1 min-h-[245px] duration-300 text-white  border border-transparent hover:border-main-color rounded-full  transition-300">
            <p className="cursor-pointer border-b-2 ">
              <svg
                stroke="currentColor"
                fill="currentColor"
                stroke-width="0"
                viewBox="0 0 448 512"
                className="hover:text-main-color m-1 hover:transition-300 transition-300 hover:scale-100 cursor-pointer "
                height="27"
                width="27"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M240.971 130.524l194.343 194.343c9.373 9.373 9.373 24.569 0 33.941l-22.667 22.667c-9.357 9.357-24.522 9.375-33.901.04L224 227.495 69.255 381.516c-9.379 9.335-24.544 9.317-33.901-.04l-22.667-22.667c-9.373-9.373-9.373-24.569 0-33.941L207.03 130.525c9.372-9.373 24.568-9.373 33.941-.001z"></path>
              </svg>
            </p>
            <div style={{height: "fit-content;"}}>
              <div className="block}">
                <a
                  className="transition duration-500 hover:text-main-color-dark"
                  href="#home"
                >
                  <p>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 576 512"
                      className="hover:text-main-color m-1 hover:transition-300 transition-300 hover:scale-100 cursor-pointer"
                      height="27"
                      width="27"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M280.37 148.26L96 300.11V464a16 16 0 0 0 16 16l112.06-.29a16 16 0 0 0 15.92-16V368a16 16 0 0 1 16-16h64a16 16 0 0 1 16 16v95.64a16 16 0 0 0 16 16.05L464 480a16 16 0 0 0 16-16V300L295.67 148.26a12.19 12.19 0 0 0-15.3 0zM571.6 251.47L488 182.56V44.05a12 12 0 0 0-12-12h-56a12 12 0 0 0-12 12v72.61L318.47 43a48 48 0 0 0-61 0L4.34 251.47a12 12 0 0 0-1.6 16.9l25.5 31A12 12 0 0 0 45.15 301l235.22-193.74a12.19 12.19 0 0 1 15.3 0L530.9 301a12 12 0 0 0 16.9-1.6l25.5-31a12 12 0 0 0-1.7-16.93z"></path>
                    </svg>
                  </p>
                </a>
                <a
                  className="transition duration-500 hover:text-main-color-dark "
                  href="#manageCustomers"
                >
                  <p>
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="hover:text-main-color m-1 hover:transition-300 transition-300 hover:scale-100 cursor-pointer"
                      height="27"
                      width="27"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="m3 15 5.12-5.12A3 3 0 0 1 10.24 9H13a2 2 0 1 1 0 4h-2.5m4-.68 4.17-4.89a1.88 1.88 0 0 1 2.92 2.36l-4.2 5.94A3 3 0 0 1 14.96 17H9.83a2 2 0 0 0-1.42.59L7 19"></path>
                      <path d="m2 14 6 6"></path>
                    </svg>
                  </p>
                </a>
                <a
                  className="text-main-color transition duration-500 hover:text-main-color-dark"
                  href="#customizedTimeLine"
                >
                  <p>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 24 24"
                      className="hover:text-main-color m-1 hover:transition-300 transition-300 hover:scale-100 cursor-pointer"
                      height="27"
                      width="27"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path fill="none" d="M0 0h24v24H0z"></path>
                      <path d="M23 8c0 1.1-.9 2-2 2a1.7 1.7 0 01-.51-.07l-3.56 3.55c.05.16.07.34.07.52 0 1.1-.9 2-2 2s-2-.9-2-2c0-.18.02-.36.07-.52l-2.55-2.55c-.16.05-.34.07-.52.07s-.36-.02-.52-.07l-4.55 4.56c.05.16.07.33.07.51 0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2c.18 0 .35.02.51.07l4.56-4.55C8.02 9.36 8 9.18 8 9c0-1.1.9-2 2-2s2 .9 2 2c0 .18-.02.36-.07.52l2.55 2.55c.16-.05.34-.07.52-.07s.36.02.52.07l3.55-3.56A1.7 1.7 0 0119 8c0-1.1.9-2 2-2s2 .9 2 2z"></path>
                    </svg>
                  </p>
                </a>
                <a
                  className="transition duration-500 hover:text-main-color-dark"
                  href="#freeAccess"
                >
                  <p>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 24 24"
                      className="hover:text-main-color m-1 hover:transition-300 transition-300 hover:scale-100 cursor-pointer"
                      height="27"
                      width="27"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 10C14.2091 10 16 8.20914 16 6 16 3.79086 14.2091 2 12 2 9.79086 2 8 3.79086 8 6 8 8.20914 9.79086 10 12 10ZM5.5 13C6.88071 13 8 11.8807 8 10.5 8 9.11929 6.88071 8 5.5 8 4.11929 8 3 9.11929 3 10.5 3 11.8807 4.11929 13 5.5 13ZM21 10.5C21 11.8807 19.8807 13 18.5 13 17.1193 13 16 11.8807 16 10.5 16 9.11929 17.1193 8 18.5 8 19.8807 8 21 9.11929 21 10.5ZM12 11C14.7614 11 17 13.2386 17 16V22H7V16C7 13.2386 9.23858 11 12 11ZM5 15.9999C5 15.307 5.10067 14.6376 5.28818 14.0056L5.11864 14.0204C3.36503 14.2104 2 15.6958 2 17.4999V21.9999H5V15.9999ZM22 21.9999V17.4999C22 15.6378 20.5459 14.1153 18.7118 14.0056 18.8993 14.6376 19 15.307 19 15.9999V21.9999H22Z"></path>
                    </svg>
                  </p>
                </a>
                <a
                  className=" transition duration-500 hover:text-main-color-dark"
                  href="#partners"
                >
                  <p>
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      stroke-width="0"
                      viewBox="0 0 640 512"
                      className="hover:text-main-color m-1 hover:transition-300 transition-300 hover:scale-100 cursor-pointer"
                      height="27"
                      width="27"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M434.7 64h-85.9c-8 0-15.7 3-21.6 8.4l-98.3 90c-.1.1-.2.3-.3.4-16.6 15.6-16.3 40.5-2.1 56 12.7 13.9 39.4 17.6 56.1 2.7.1-.1.3-.1.4-.2l79.9-73.2c6.5-5.9 16.7-5.5 22.6 1 6 6.5 5.5 16.6-1 22.6l-26.1 23.9L504 313.8c2.9 2.4 5.5 5 7.9 7.7V128l-54.6-54.6c-5.9-6-14.1-9.4-22.6-9.4zM544 128.2v223.9c0 17.7 14.3 32 32 32h64V128.2h-96zm48 223.9c-8.8 0-16-7.2-16-16s7.2-16 16-16 16 7.2 16 16-7.2 16-16 16zM0 384h64c17.7 0 32-14.3 32-32V128.2H0V384zm48-63.9c8.8 0 16 7.2 16 16s-7.2 16-16 16-16-7.2-16-16c0-8.9 7.2-16 16-16zm435.9 18.6L334.6 217.5l-30 27.5c-29.7 27.1-75.2 24.5-101.7-4.4-26.9-29.4-24.8-74.9 4.4-101.7L289.1 64h-83.8c-8.5 0-16.6 3.4-22.6 9.4L128 128v223.9h18.3l90.5 81.9c27.4 22.3 67.7 18.1 90-9.3l.2-.2 17.9 15.5c15.9 13 39.4 10.5 52.3-5.4l31.4-38.6 5.4 4.4c13.7 11.1 33.9 9.1 45-4.7l9.5-11.7c11.2-13.8 9.1-33.9-4.6-45.1z"></path>
                    </svg>
                  </p>
                </a>
                <a
                  className="transition duration-500 hover:text-main-color-dark"
                  href="#callUs"
                >
                  <p>
                    <svg
                      stroke="currentColor"
                      fill="none"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="hover:text-main-color m-1 hover:transition-300 transition-300 hover:scale-100 cursor-pointer"
                      height="27"
                      width="27"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      <path d="M14.05 2a9 9 0 0 1 8 7.94"></path>
                      <path d="M14.05 6A5 5 0 0 1 18 10"></path>
                    </svg>
                  </p>
                </a>
              </div>
            </div>
          </div>
        </nav>)
}