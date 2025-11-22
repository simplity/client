// Auto-generated HTML collection

    const htmls = {
      '_button-panel': `<!--
    this is an item of the parent grid. we need to set col-span.
    data-full is the signal to the html-utl to set cal-span to get the full row

    button-panel is divided into left, center and right buttons.
    each of them render buttons
-->
<div data-full class="flex flex-row w-full mt-3">
  <div data-id="left" class="flex flex-row justify-start basis-1/3"></div>
  <div data-id="middle" class="flex flex-row justify-center basis-1/3"></div>
  <div data-id="right" class="flex flex-row justify-end basis-1/3"></div>
</div>
`,
  '_button': `<button
  data-id="label"
  type="button"
  class="
    rounded-md bg-indigo-600 px-2.5 py-1.5 mx-2 text-sm font-semibold text-white shadow-sm 
    hover:bg-indigo-500
    focus-visible:[outline-2 outline-offset-2 outline-indigo-600]"
></button>
<!-- w-auto -->

`,
  '_calendar': `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
  />
</svg>
`,
  '_chart': `<div data-full class="mx-4 flex justify-center rounded-lg border-gray-200">
  <canvas data-id="chart" class="w-1/2! h-auto!"></canvas>
</div>
`,
  '_charts': `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z"
  />
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z"
  />
</svg>
`,
  '_check-box': `<!--  We may think about providing a border to this element, so that it looks similar to text-field in a form -->
<div class="mx-4">
  <label class="block h-6 items-center">
    <input
      type="checkbox"
      data-id="field"
      class="h-4 w-4 rounded-sm border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
    />
    <span
      data-id="label"
      class="dark:[text-gray-400 bg-gray-900] bg-white px-1 text-sm text-gray-500"
    ></span>
  </label>
  <div>
    <p
      data-id="description"
      class="mt-2 text-xs text-gray-500 dark:text-gray-400"
    ></p>
  </div>
</div>
`,
  '_content': `<span class="mx-4"></span>
`,
  '_date-field': `<!-- prettier-ignore -->
<div data-init="_initDatePicker" data-id="text-field" class="group mx-4">
  <label class="relative">
    <input
      data-id="field"
      type="text"
      class="
        block pl-8 pr-2.5 pb-2.5 pt-3 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300
        focus:outline-none focus:ring-0 focus:border-blue-600
        group-data-invalid:border-red-600
        group-data-disabled:text-gray-300 group-data-disabled:cursor-not-allowed
        focus:group-data-invalid:border-red-600 

        dark:text-white dark:border-gray-600 dark:bg-gray-900
        dark:focus:text-white dark:focus:border-blue-500
        dark:group-data-invalid:border-red-500 
        dark:group-data-disabled:text-gray-600
        dark:focus:group-data-invalid:border-red-500 
      "
    />
    <span class="absolute inset-y-0 left-2 top-1 flex items-center text-gray-500">
      📅
    </span>
    <span
      data-id="label"
      class="
        absolute -top-3 w-max left-2 px-2 text-sm text-gray-500 bg-white
        dark:text-gray-400 dark:bg-gray-900
      "
    ></span>
  </label>
  <p
    data-id="description"
    class="
      mt-2 text-xs text-gray-500 
      group-data-invalid:text-red-600 
      dark:text-gray-400 
      dark:group-data-invalid:text-red-400
    "
  ></p>
</div>
`,
  '_dialog': ``,
  '_disable-ux': `<!--
    spinner
-->
<div
  data-hidden
  class="fixed inset-0 bg-gray-600/50 flex items-center justify-center z-50"
  id="spinner-modal"
>
  <div
    class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"
  ></div>
</div>
`,
  '_files': `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
  />
</svg>
`,
  '_grid': `<div data-id="container" class="mx-4">
  <div class="mt-2 sm:flex sm:items-center">
    <div
      data-id="label"
      class="text-base font-semibold leading-6 text-gray-900 sm:flex-auto"
    ></div>
  </div>
  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <!--
            data-selectable
            data-sortable
          -->
        <table data-id="table" class="min-w-full divide-y divide-gray-300">
          <thead>
            <tr data-id="header">
              <th
                scope="col"
                class="p3-3 py-2 text-left text-sm font-semibold text-gray-900 sm:pl-0"
              ></th>
            </tr>
          </thead>
          <tbody data-id="rows" class="divide-y divide-gray-200 bg-white">
            <!-- 
              1. if NOT 'selectable' then even:bg-gray-50
              2. if 'selectable' then hover:bg-gray-50, selected/active: bg-gray-200 text-gray-900 group-hover:bg-gray-300
              -->
            <!-- prettier-ignore -->
            <tr
              data-id="row"
              class="
                cursor-pointer
               group-data-selectable:bg-white group-data-selectable:cursor-auto
               data-selected:bg-gray-200 data-selected:text-gray-900
               hover:bg-gray-300  
               even:bg-gray-50
              "
            >
              <td
                class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
              ></td>
            </tr>
          </tbody>
        </table>
        <!-- prettier-ignore -->
        <button
          data-id="add-button"
          type="button"
          class="
            w-auto rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm
            hover:bg-indigo-500
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
          "
        >
          +
        </button>
      </div>
    </div>
  </div>
</div>
`,
  '_home': `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-6 w-6 shrink-0 text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
  />
</svg>
`,
  '_icon': ``,
  '_image-field': ``,
  '_image': `<img />
`,
  '_index': `<!doctype html>
<html
  class="h-full bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
  data-theme="dark"
>
  <head>
    <meta charset="UTF-8" />
    <title>Simplity Example</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="styles.css" />

    <!--
    <link
      href="https://cdn.jsdelivr.net/npm/flowbite@2.5.2/dist/flowbite.min.css"
      rel="stylesheet"
    />
    <script src="https://cdn.tailwindcss.com"></script>
    -->
    <script src="main.js"></script>
  </head>
  <body
    class="flex h-full min-h-screen grow flex-col items-center justify-between gap-y-5 overflow-y-auto"
  >
    <div class="w-full" id="app"></div>
    <footer class="fl w-full bg-blue-600 shadow-lg">
      <div class="text-center text-sm text-white">
        <span>Copyright © 2016-2025 simplity.org. All rights reserved.</span>
      </div>
    </footer>
  </body>
</html>
`,
  '_layout': `<div>
  <header
    class="flex h-16 items-center justify-between bg-gray-800/50 px-4 py-2 sm:px-6 lg:px-8"
  >
    <div class="flex items-center gap-6">
      <div
        class="flex shrink-0 items-center *:h-8 *:w-auto"
        data-id="logo"
      ></div>
      <nav><ul data-id="menu-bar" class="flex space-x-6"></ul></nav>
    </div>
    <div data-id="color-theme" class="grid grid-cols-1 max-sm:hidden">
      <div
        class="p-0.75 relative z-0 inline-grid grid-cols-3 gap-0.5 rounded-full bg-gray-950/5 text-gray-950 dark:bg-white/10 dark:text-white"
      >
        <!-- prettier-ignore -->
        <div
          class="
            relative rounded-full p-1.5 *:size-7 sm:p-0
            has-checked:bg-white has-checked:ring has-checked:inset-ring has-checked:ring-gray-950/10 has-checked:inset-ring-white/10
            dark:has-checked:bg-gray-600 dark:has-checked:text-white dark:has-checked:ring-transparent 
          "
        >
          <input
            type="radio"
            class="absolute inset-0 appearance-none opacity-0"
            name="t-h-e-m-e"
            aria-label="System theme"
            value="system"
            checked=""
          />
          <svg viewBox="0 0 28 28" fill="none">
            <path
              d="M7.5 8.5C7.5 7.94772 7.94772 7.5 8.5 7.5H19.5C20.0523 7.5 20.5 7.94772 20.5 8.5V16.5C20.5 17.0523 20.0523 17.5 19.5 17.5H8.5C7.94772 17.5 7.5 17.0523 7.5 16.5V8.5Z"
              stroke="currentColor"
            ></path>
            <path
              d="M7.5 8.5C7.5 7.94772 7.94772 7.5 8.5 7.5H19.5C20.0523 7.5 20.5 7.94772 20.5 8.5V14.5C20.5 15.0523 20.0523 15.5 19.5 15.5H8.5C7.94772 15.5 7.5 15.0523 7.5 14.5V8.5Z"
              stroke="currentColor"
            ></path>
            <path
              d="M16.5 20.5V17.5H11.5V20.5M16.5 20.5H11.5M16.5 20.5H17.5M11.5 20.5H10.5"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
          </svg>
        </div>
        <div
          class="has-checked:bg-white has-checked:ring has-checked:inset-ring has-checked:ring-gray-950/10 has-checked:inset-ring-white/10 dark:has-checked:bg-gray-600 dark:has-checked:text-white dark:has-checked:ring-transparent relative rounded-full p-1.5 *:size-7 sm:p-0"
        >
          <input
            type="radio"
            class="absolute inset-0 appearance-none opacity-0"
            name="t-h-e-m-e"
            aria-label="Light theme"
            value="light"
          />
          <svg viewBox="0 0 28 28" fill="none">
            <circle cx="14" cy="14" r="3.5" stroke="currentColor"></circle>
            <path
              d="M14 8.5V6.5"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
            <path
              d="M17.889 10.1115L19.3032 8.69727"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
            <path
              d="M19.5 14L21.5 14"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
            <path
              d="M17.889 17.8885L19.3032 19.3027"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
            <path
              d="M14 21.5V19.5"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
            <path
              d="M8.69663 19.3029L10.1108 17.8887"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
            <path
              d="M6.5 14L8.5 14"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
            <path
              d="M8.69663 8.69711L10.1108 10.1113"
              stroke="currentColor"
              stroke-linecap="round"
            ></path>
          </svg>
        </div>
        <div
          class="has-checked:bg-white has-checked:ring has-checked:inset-ring has-checked:ring-gray-950/10 has-checked:inset-ring-white/10 dark:has-checked:bg-gray-600 dark:has-checked:text-white dark:has-checked:ring-transparent relative rounded-full p-1.5 *:size-7 sm:p-0"
        >
          <input
            type="radio"
            class="absolute inset-0 appearance-none opacity-0"
            name="t-h-e-m-e"
            aria-label="Dark theme"
            value="dark"
          />
          <svg viewBox="0 0 28 28" fill="none">
            <path
              d="M10.5 9.99914C10.5 14.1413 13.8579 17.4991 18 17.4991C19.0332 17.4991 20.0176 17.2902 20.9132 16.9123C19.7761 19.6075 17.109 21.4991 14 21.4991C9.85786 21.4991 6.5 18.1413 6.5 13.9991C6.5 10.8902 8.39167 8.22304 11.0868 7.08594C10.7089 7.98159 10.5 8.96597 10.5 9.99914Z"
              stroke="currentColor"
              stroke-linejoin="round"
            ></path>
            <path
              d="M16.3561 6.50754L16.5 5.5L16.6439 6.50754C16.7068 6.94752 17.0525 7.29321 17.4925 7.35607L18.5 7.5L17.4925 7.64393C17.0525 7.70679 16.7068 8.05248 16.6439 8.49246L16.5 9.5L16.3561 8.49246C16.2932 8.05248 15.9475 7.70679 15.5075 7.64393L14.5 7.5L15.5075 7.35607C15.9475 7.29321 16.2932 6.94752 16.3561 6.50754Z"
              fill="currentColor"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
            <path
              d="M20.3561 11.5075L20.5 10.5L20.6439 11.5075C20.7068 11.9475 21.0525 12.2932 21.4925 12.3561L22.5 12.5L21.4925 12.6439C21.0525 12.7068 20.7068 13.0525 20.6439 13.4925L20.5 14.5L20.3561 13.4925C20.2932 13.0525 19.9475 12.7068 19.5075 12.6439L18.5 12.5L19.5075 12.3561C19.9475 12.2932 20.2932 11.9475 20.3561 11.5075Z"
              fill="currentColor"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  </header>
  <main data-id="page" class="w-full grow">
    <!-- Page is rendered here-->
  </main>
</div>
`,
  '_line': `<hr data-full class="h-px my-8 bg-gray-200 border-0" />
`,
  '_logo': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 47 40" fill="none">
  <path
    fill="#a5b4fc"
    d="M23.5 6.5C17.5 6.5 13.75 9.5 12.25 15.5C14.5 12.5 17.125 11.375 20.125 12.125C21.8367 12.5529 23.0601 13.7947 24.4142 15.1692C26.6202 17.4084 29.1734 20 34.75 20C40.75 20 44.5 17 46 11C43.75 14 41.125 15.125 38.125 14.375C36.4133 13.9471 35.1899 12.7053 33.8357 11.3308C31.6297 9.09158 29.0766 6.5 23.5 6.5ZM12.25 20C6.25 20 2.5 23 1 29C3.25 26 5.875 24.875 8.875 25.625C10.5867 26.0529 11.8101 27.2947 13.1642 28.6693C15.3702 30.9084 17.9234 33.5 23.5 33.5C29.5 33.5 33.25 30.5 34.75 24.5C32.5 27.5 29.875 28.625 26.875 27.875C25.1633 27.4471 23.9399 26.2053 22.5858 24.8307C20.3798 22.5916 17.8266 20 12.25 20Z"
  />
  <defs>
    <linearGradient
      id="%%GRADIENT_ID%%"
      x1="33.999"
      x2="1"
      y1="16.181"
      y2="16.181"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="%%GRADIENT_TO%%" />
      <stop offset="1" stop-color="%%GRADIENT_FROM%%" />
    </linearGradient>
  </defs>
</svg>
`,
  '_menu-item': `<li data-clickable>
  <button
    data-id="label"
    role="menuitem"
    class="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
  ></button>
</li>
`,
  '_message': `<!-- Global notification live region, render this permanently at the end of the document -->
<div
  id="m_e_s_s_a_g_e"
  data-hidden
  aria-live="assertive"
  class="pointer-events-none fixed inset-0 right-5 top-5 flex items-end px-4 py-6 sm:items-start sm:p-6"
>
  <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
    <!--
        Notification panel, dynamically insert this into the live region when it needs to be displayed
  
        Entering: "transform ease-out duration-300 transition"
          From: "translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
          To: "translate-y-0 opacity-100 sm:translate-x-0"
        Leaving: "transition ease-in duration-100"
          From: "opacity-100"
          To: "opacity-0"
      -->
    <div
      class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5"
    >
      <div class="p-4">
        <div class="flex items-start">
          <!--             
            <div class="shrink-0">
              <svg class="size-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
        -->
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p data-id="message" class="mt-1 text-sm text-gray-500"></p>
          </div>
          <div class="ml-4 flex shrink-0">
            <!-- prettier-ignore -->
            <button
              onclick="var p = document.getElementById('m_e_s_s_a_g_e'); p.querySelector('p').innerText=''; p.setAttribute('data-hidden', '')"
              type="button"
              class="
                inline-flex rounded-md bg-white text-gray-400 
                hover:text-gray-500 
                focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
              "
            >
              <span class="sr-only">Close</span>
              <svg
                class="size-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
`,
  '_module': `<!-- prettier-ignore -->
<li data-clickable class="group">
  <button
    role="menuitem"
    class="
      flex items-center justify-between w-full py-2 pl-3 pr-4
      text-gray-500 group-data-current:text-white
      hover:text-white 
    "
 >
    <span data-id="label"></span>
    <svg
      data-id="arrow-icon"
      class="w-2.5 h-2.5 ml-2.5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 10 6"
    >
      <path
        stroke="currentColor"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="m1 1 4 4 4-4"
      />
    </svg>
  </button>
  <div
    class="
      absolute z-10 hidden font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44
      group-data-empty:hidden!
      group-focus-within:block group-hover:block
      hover:block 
      dark:bg-gray-700 dark:divide-gray-600
    "
  >
    <ul
      data-id="menu-item"
      class="py-2 text-sm text-gray-700 dark:text-gray-400"
    ></ul>
  </div>
</li>
`,
  '_output': `<div class="mx-4">
  <label data-id="label"></label>
  <span data-id="field"></span>
</div>
`,
  '_page-with-border': `<div class="white p-3 antialiased">
  <div
    class="w-full rounded-t-xl border border-b-0 border-gray-200 bg-gray-100 py-2 text-gray-900 dark:border-gray-800"
  >
    <h2
      data-id="title"
      class="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-gray-100"
    ></h2>
  </div>

  <div
    class="rounded-b-x min-h-full border border-gray-200 dark:border-gray-800"
  >
    <div
      data-id="data"
      class="sgap-4 mb-3 mt-3 grid w-full grid-cols-4 sm:mx-auto sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-12"
    ></div>
    <div data-id="buttons" class="mt-6 w-full gap-4 sm:mx-auto"></div>
  </div>
</div>
`,
  '_page': `<div class="bg-white dark:bg-gray-900">
  <div class="sm:mx-auto sm:w-full sm:max-w-sm">
    <h2
      data-id="title"
      class="mt-3 text-center text-2xl font-bold leading-9 tracking-tight"
    ></h2>
  </div>

  <!-- _form-container is a class-name and not a tailwind utility.
    this is an exception to our rule of avoiding custom class-names.
    -->
  <div
    data-id="data"
    class="_form-container mb-3 mt-3 grid w-full gap-4 space-y-2 sm:mx-auto"
  ></div>
  <div data-id="buttons" class="mt-6 w-full gap-4 sm:mx-auto"></div>
</div>
`,
  '_panel-flex': `<!-- 
    flex panel.
    Note that the contents of this panel will not be aligned with anything outside of this panel
-->
<div data-id="container" class="mx-2 flex flex-row justify-center"></div>
`,
  '_panel-grid': `<!-- 
    container has two divs: one for export options and the other one for the gridJs to render the table
-->
<div data-full class="relative mx-2 rounded-lg border-2 p-2 shadow-md">
  <div
    data-id="export"
    class="absolute right-4 my-4 flex flex-row justify-end gap-4"
  ></div>
  <div data-id="table"></div>
</div>
`,
  '_panel-modal': `<!--
  wrapper-panel that renders its content as modal at the centre of the page
-->
<div
  data-hidden
  class="relative z-10"
  aria-labelledby="modal-title"
  role="dialog"
  aria-modal="true"
>
  <!--
  Background backdrop, show/hide based on modal state.

  Entering: "ease-out duration-300"
    From: "opacity-0"
    To: "opacity-100"
  Leaving: "ease-in duration-200"
    From: "opacity-100"
    To: "opacity-0"
-->
  <div
    class="fixed inset-0 bg-gray-500/75 transition-opacity"
    aria-hidden="true"
  ></div>

  <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
    <div
      class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
    >
      <!--
      Modal panel, show/hide based on modal state.

      Entering: "ease-out duration-300"
        From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        To: "opacity-100 translate-y-0 sm:scale-100"
      Leaving: "ease-in duration-200"
        From: "opacity-100 translate-y-0 sm:scale-100"
        To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
    -->
      <div
        data-id="page"
        class="relative transform overflow-auto rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-3/4 sm:p-6"
      ></div>
    </div>
  </div>
</div>
`,
  '_panel-outline': `<div
  data-full
  class="relative m-2 grid w-80 grid-cols-subgrid gap-4 rounded-lg border border-gray-500 py-8"
>
  <!-- Label inside the border -->
  <label
    data-id="label"
    class="m-x-2 absolute -top-3 left-3 bg-white px-1 text-sm text-gray-500 dark:bg-gray-900 dark:text-gray-400"
  ></label>

  <!-- Fields inside -->
  <div data-id="container" class="grid grid-cols-subgrid gap-4"></div>
</div>
`,
  '_panel': `<!--
  default panel. 
  data-full means -> take all the width available for the parent default is 12 columns
  data-id="container" is to mark the element as the container of the children
  That is, the child elements of the panel will be appended to this element.
-->
<div
  data-id="container"
  data-full
  class="mt-1 grid grid-cols-subgrid gap-4 sm:mx-auto"
></div>
`,
  '_password': `<!-- prettier-ignore -->
<div data-id="text-field" class="group mx-4">
  <label class="relative">
    <input
      data-id="field"
      data-empty
      type="password"
      class="
        block w-full px-2.5 pb-2.5 pt-4 text-sm rounded-lg border text-gray-900 bg-white  border-gray-300
        focus:outline-none focus:ring-blue-500 focus:border-blue-500
        group-data-invalid:border-red-600
        group-data-disabled:text-gray-300 group-data-disabled:cursor-not-allowed
        focus:group-data-invalid:border-red-600 

        dark:text-white dark:border-gray-600 dark:bg-gray-900
        dark:focus:text-white dark:focus:border-blue-500
        dark:group-data-invalid:border-red-500 
        dark:group-data-disabled:text-gray-600
        dark:focus:group-data-invalid:border-red-500 
     "
    />
    <span
      data-id="label"
      class="
        absolute -top-3 left-2 px-2 w-max text-sm text-gray-500 bg-white
        dark:text-gray-400 dark:bg-gray-900
      "
    ></span>
  </label>
  <p
    data-id="description"
    class="
      mt-2 text-xs text-gray-500 
      group-data-invalid:text-red-600 
      dark:text-gray-400 
      dark:group-data-invalid:text-red-400
    "
  ></p>
</div>
<!-- 
  This is the base template that all other fields clone and modify as needed 
-->
`,
  '_reports': `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"
  />
</svg>
`,
  '_select-output': `<div class="mx-4">
  <label data-id="label"></label>
  <span data-id="field"></span>
</div>
`,
  '_select': `<!-- 
  This is a clone of _text-field.html. Obvioulsy, <input> is replaced with <select>
-->

<!-- prettier-ignore -->
<div data-id="text-field" class="group mx-4">
  <label class="relative">
    <select
      data-id="field"
      class="
        block w-full rounded-lg border border-gray-300 bg-white px-2.5 pb-2.5 pt-3 text-sm text-gray-900
        group-data-disabled:text-gray-300 group-data-disabled:cursor-not-allowed
        focus:border-blue-500 focus:ring-blue-500
        dark:border-gray-600 dark:bg-gray-900 dark:text-white dark:placeholder-gray-400 
        dark:focus:border-blue-500 dark:focus:ring-blue-500
      "

   ></select>
    <span
      data-id="label"
      class="
        absolute -top-3 left-2 px-2 w-max text-sm text-gray-500 bg-white
        dark:text-gray-400 dark:bg-gray-900
      "
    ></span>
  </label>
  <p
    data-id="description"
    class="
      mt-2 text-xs text-gray-500 
      group-data-invalid:text-red-600
      dark:text-gray-400
      dark:group-data-invalid:text-red-400"
  ></p>
</div>
`,
  '_settings': `<a
  href="#"
  class="group-mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
>
  <svg
    class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
    />
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
  Settings
</a>
`,
  '_snackbar': ``,
  '_sortable-header': `<th
  scope="col"
  class="group-px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
>
  <div class="inline-flex cursor-pointer">
    <span data-id="label"></span>
    <!-- prettier-ignore -->
    <span
      class="
        invisible ml-2 flex-none rounded text-gray-400 
        group-hover:visible 
        group-focus:visible 
        group-data-sorted:bg-gray-200 group-data-sorted:visible group-data-sorted:text-gray-900
        group-data-sorted:group-focus:bg-gray-300
      "
    >
      <svg
        class="size-5"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
        data-slot="icon"
      >
        <path
          fill-rule="evenodd"
          d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
          clip-rule="evenodd"
        />
      </svg>
    </span>
  </div>
</th>
`,
  '_tab-label': ``,
  '_tab': ``,
  '_table': `<div data-id="container" class="px-4 sm:px-6 lg:px-8">
  <div class="sm:flex sm:items-center">
    <div
      data-id="label"
      class="text-base font-semibold leading-6 text-gray-900 sm:flex-auto"
    ></div>
  </div>
  <div data-id="list-config"></div>

  <div data-id="search" class="relative w-80">
    <!-- prettier-ignore -->
    <input
      type="text"
      class="
        w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-lg shadow-sm 
        focus:[outline-none ring-2 ring-blue-500]
      "
      placeholder="Search..."
    />
    <div
      class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
    >
      <svg
        class="h-5 w-5 text-gray-500"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path
          fill-rule="evenodd"
          d="M12.9 14.32a7 7 0 111.41-1.41l4.3 4.29a1 1 0 01-1.42 1.42l-4.29-4.3zm-6.4-3.9a5 5 0 100-10 5 5 0 000 10z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>

  <div class="mt-8 flow-root">
    <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div class="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
          <!-- min-w-full -->

          <!--
            data-selectable
            data-sortable
          -->
          <table data-id="table" class="min-w-full divide-y divide-gray-300">
            <!-- min-w-full -->

            <thead>
              <tr data-id="header">
                <th
                  scope="col"
                  class="p3-3 py-2 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                ></th>
              </tr>
            </thead>
            <tbody data-id="rows" class="divide-y divide-gray-200 bg-white">
              <!-- 
              1. if NOT 'selectable' then even:bg-gray-50
              2. if 'selectable' then hover:bg-gray-50, selected/active: bg-gray-200 text-gray-900 group-hover:bg-gray-300
              -->
              <!-- prettier-ignore -->
              <tr
                data-id="row"
                class="
                data-selectable:bg-white data-selectable:cursor-auto 
                data-selected:bg-gray-200 data-selected:text-gray-900
                hover:bg-gray-300 
                even:bg-gray-50"
              >
                <td
                  class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0"
                ></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</div>
`,
  '_tabs': ``,
  '_team-icom': `<svg
  xmlns="http://www.w3.org/2000/svg"
  class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
  fill="none"
  viewBox="0 0 24 24"
  stroke-width="1.5"
  stroke="currentColor"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
  />
</svg>
`,
  '_text-area': `<!-- prettier-ignore -->
<div data-id="text-field" class="group mx-4">
  <label class="relative">
    <textarea
      data-id="field"
      rows="4"
      class="
        block w-full px-2.5 pb-2.5 pt-4 text-sm rounded-lg border text-gray-900 bg-white  border-gray-300
        focus:outline-none focus:ring-blue-500 focus:border-blue-500
        group-data-invalid:border-red-600
        group-data-disabled:text-gray-300 group-data-disabled:cursor-not-allowed
        focus:group-data-invalid:border-red-600 

        dark:text-white dark:border-gray-600 dark:bg-gray-900
        dark:focus:text-white dark:focus:border-blue-500
        dark:group-data-invalid:border-red-500 
        dark:group-data-disabled:text-gray-600
        dark:focus:group-data-invalid:border-red-500 
      "
    ></textarea>
    <span
      data-id="label"
      class="
         absolute -top-3 left-2 px-2 text-sm text-gray-500 bg-white
        dark:text-gray-400 dark:bg-gray-900
      "
    ></span>
  </label>
  <p
    data-id="description"
    class="mt-2 text-xs text-gray-500
     group-data-invalid:text-red-600
     dark:text-gray-400 
     group-data-invalid:dark:text-red-400
    "
  ></p>
</div>
`,
  '_text-field': `<!-- prettier-ignore -->
<div data-id="text-field" class="group mx-4">
  <label class="relative">
    <input
      data-id="field"
      data-empty
      type="text"
      class="
        block w-full px-2.5 pb-2.5 pt-3 text-sm rounded-lg border text-gray-900 bg-white  border-gray-300
        focus:outline-none focus:ring-blue-500 focus:border-blue-500
        group-data-invalid:border-red-600
        group-data-disabled:text-gray-300 group-data-disabled:cursor-not-allowed
        focus:group-data-invalid:border-red-600 

        dark:text-white dark:border-gray-600 dark:bg-gray-900
        dark:focus:text-white dark:focus:border-blue-500
        dark:group-data-invalid:border-red-500 
        dark:group-data-disabled:text-gray-600
        dark:focus:group-data-invalid:border-red-500 
      "
    />
    <span
      data-id="label"
      class="
        absolute -top-3 left-2 px-2 w-max text-sm text-gray-500 bg-white
        dark:text-gray-400 dark:bg-gray-900
      "
    ></span>
  </label>
  <p
    data-id="description"
    class="
      mt-2 text-xs text-gray-500 w-max
      group-data-invalid:text-red-600 
      dark:text-gray-400 
      dark:group-data-invalid:text-red-400
    "
  ></p>
</div>
<!-- 
  This is the base template that all other fields clone and modify as needed 
-->
`,
  '_user-icon': `<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="currentColor"
  class="size-6"
>
  <path
    fill-rule="evenodd"
    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
    clip-rule="evenodd"
  />
</svg>
`,

    }

/** 
 * All the html fragments defined in the library
 **/    
export type HtmlName = keyof typeof htmls;
/**
 * all the html fragments defined in the library
 */
export const allHtmls: { [key in HtmlName]: string } = htmls;

/**
 * All CSS classes used in the HTML fragments
 */
export const allClasses: string[] = [
  "flex",
  "flex-row",
  "w-full",
  "mt-3",
  "justify-start",
  "basis-1/3",
  "justify-center",
  "justify-end",
  "rounded-md",
  "bg-indigo-600",
  "px-2.5",
  "py-1.5",
  "mx-2",
  "text-sm",
  "font-semibold",
  "text-white",
  "shadow-sm",
  "hover:bg-indigo-500",
  "focus-visible:[outline-2",
  "outline-offset-2",
  "outline-indigo-600]",
  "h-6",
  "w-6",
  "shrink-0",
  "text-indigo-200",
  "group-hover:text-white",
  "mx-4",
  "rounded-lg",
  "border-gray-200",
  "w-1/2!",
  "h-auto!",
  "block",
  "items-center",
  "h-4",
  "w-4",
  "rounded-sm",
  "border-gray-300",
  "bg-gray-100",
  "text-blue-600",
  "focus:ring-2",
  "focus:ring-blue-500",
  "dark:border-gray-600",
  "dark:bg-gray-700",
  "dark:ring-offset-gray-800",
  "dark:focus:ring-blue-600",
  "dark:[text-gray-400",
  "bg-gray-900]",
  "bg-white",
  "px-1",
  "text-gray-500",
  "mt-2",
  "text-xs",
  "dark:text-gray-400",
  "group",
  "relative",
  "pl-8",
  "pr-2.5",
  "pb-2.5",
  "pt-3",
  "text-gray-900",
  "border",
  "focus:outline-none",
  "focus:ring-0",
  "focus:border-blue-600",
  "group-data-invalid:border-red-600",
  "group-data-disabled:text-gray-300",
  "group-data-disabled:cursor-not-allowed",
  "focus:group-data-invalid:border-red-600",
  "dark:text-white",
  "dark:bg-gray-900",
  "dark:focus:text-white",
  "dark:focus:border-blue-500",
  "dark:group-data-invalid:border-red-500",
  "dark:group-data-disabled:text-gray-600",
  "dark:focus:group-data-invalid:border-red-500",
  "absolute",
  "inset-y-0",
  "left-2",
  "top-1",
  "-top-3",
  "w-max",
  "px-2",
  "group-data-invalid:text-red-600",
  "dark:group-data-invalid:text-red-400",
  "fixed",
  "inset-0",
  "bg-gray-600/50",
  "z-50",
  "animate-spin",
  "rounded-full",
  "h-32",
  "w-32",
  "border-t-2",
  "border-b-2",
  "border-blue-500",
  "sm:flex",
  "sm:items-center",
  "text-base",
  "leading-6",
  "sm:flex-auto",
  "mt-8",
  "flow-root",
  "-mx-4",
  "-my-2",
  "overflow-x-auto",
  "sm:-mx-6",
  "lg:-mx-8",
  "inline-block",
  "min-w-full",
  "py-2",
  "align-middle",
  "sm:px-6",
  "lg:px-8",
  "divide-y",
  "divide-gray-300",
  "p3-3",
  "text-left",
  "sm:pl-0",
  "divide-gray-200",
  "cursor-pointer",
  "group-data-selectable:bg-white",
  "group-data-selectable:cursor-auto",
  "data-selected:bg-gray-200",
  "data-selected:text-gray-900",
  "hover:bg-gray-300",
  "even:bg-gray-50",
  "whitespace-nowrap",
  "py-4",
  "pl-4",
  "pr-3",
  "font-medium",
  "w-auto",
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-indigo-600",
  "h-full",
  "dark:text-gray-100",
  "min-h-screen",
  "grow",
  "flex-col",
  "justify-between",
  "gap-y-5",
  "overflow-y-auto",
  "fl",
  "bg-blue-600",
  "shadow-lg",
  "text-center",
  "h-16",
  "bg-gray-800/50",
  "px-4",
  "gap-6",
  "*:h-8",
  "*:w-auto",
  "space-x-6",
  "grid",
  "grid-cols-1",
  "max-sm:hidden",
  "p-0.75",
  "z-0",
  "inline-grid",
  "grid-cols-3",
  "gap-0.5",
  "bg-gray-950/5",
  "text-gray-950",
  "dark:bg-white/10",
  "p-1.5",
  "*:size-7",
  "sm:p-0",
  "has-checked:bg-white",
  "has-checked:ring",
  "has-checked:inset-ring",
  "has-checked:ring-gray-950/10",
  "has-checked:inset-ring-white/10",
  "dark:has-checked:bg-gray-600",
  "dark:has-checked:text-white",
  "dark:has-checked:ring-transparent",
  "appearance-none",
  "opacity-0",
  "h-px",
  "my-8",
  "bg-gray-200",
  "border-0",
  "hover:bg-gray-100",
  "dark:hover:bg-gray-600",
  "dark:hover:text-white",
  "pointer-events-none",
  "right-5",
  "top-5",
  "items-end",
  "py-6",
  "sm:items-start",
  "sm:p-6",
  "space-y-4",
  "sm:items-end",
  "pointer-events-auto",
  "max-w-sm",
  "overflow-hidden",
  "ring-1",
  "ring-black/5",
  "p-4",
  "items-start",
  "size-6",
  "text-green-400",
  "ml-3",
  "w-0",
  "flex-1",
  "pt-0.5",
  "mt-1",
  "ml-4",
  "inline-flex",
  "text-gray-400",
  "hover:text-gray-500",
  "focus:outline-hidden",
  "focus:ring-indigo-500",
  "focus:ring-offset-2",
  "sr-only",
  "size-5",
  "pl-3",
  "pr-4",
  "group-data-current:text-white",
  "hover:text-white",
  "w-2.5",
  "h-2.5",
  "ml-2.5",
  "z-10",
  "hidden",
  "font-normal",
  "divide-gray-100",
  "shadow",
  "w-44",
  "group-data-empty:hidden!",
  "group-focus-within:block",
  "group-hover:block",
  "hover:block",
  "dark:divide-gray-600",
  "text-gray-700",
  "white",
  "p-3",
  "antialiased",
  "rounded-t-xl",
  "border-b-0",
  "dark:border-gray-800",
  "text-2xl",
  "font-bold",
  "leading-9",
  "tracking-tight",
  "rounded-b-x",
  "min-h-full",
  "sgap-4",
  "mb-3",
  "grid-cols-4",
  "sm:mx-auto",
  "sm:grid-cols-8",
  "md:grid-cols-8",
  "lg:grid-cols-12",
  "mt-6",
  "gap-4",
  "sm:w-full",
  "sm:max-w-sm",
  "_form-container",
  "space-y-2",
  "border-2",
  "p-2",
  "shadow-md",
  "right-4",
  "my-4",
  "bg-gray-500/75",
  "transition-opacity",
  "w-screen",
  "transform",
  "overflow-auto",
  "pb-4",
  "pt-5",
  "shadow-xl",
  "transition-all",
  "sm:my-8",
  "sm:w-3/4",
  "m-2",
  "w-80",
  "grid-cols-subgrid",
  "border-gray-500",
  "py-8",
  "m-x-2",
  "left-3",
  "pt-4",
  "focus:border-blue-500",
  "dark:placeholder-gray-400",
  "dark:focus:ring-blue-500",
  "group-mx-2",
  "gap-x-3",
  "hover:bg-indigo-700",
  "group-px-3",
  "py-3.5",
  "invisible",
  "ml-2",
  "flex-none",
  "rounded",
  "group-hover:visible",
  "group-focus:visible",
  "group-data-sorted:bg-gray-200",
  "group-data-sorted:visible",
  "group-data-sorted:text-gray-900",
  "group-data-sorted:group-focus:bg-gray-300",
  "pl-10",
  "focus:[outline-none",
  "ring-2",
  "ring-blue-500]",
  "left-0",
  "h-5",
  "w-5",
  "sm:rounded-lg",
  "data-selectable:bg-white",
  "data-selectable:cursor-auto",
  "group-data-invalid:dark:text-red-400"
];
