// Privacy & Cookie policy content, transcribed from the client's official
// "Contents For New Website" brief (Dante Alighieri Society Limited, PDPO).
// Kept as structured data so the pages render it consistently and it's easy to
// amend without touching layout. Editorial notes in the source doc (e.g. "please
// hyperlink to the Cookie Policy") have been resolved into real links/text.

export type LegalBlock =
  | { p: string }
  | { list: string[] };

export type LegalSection = { heading?: string; blocks: LegalBlock[] };

export const PRIVACY_UPDATED = "This policy applies to the Dante Alighieri Society of Hong Kong.";

export const privacySections: LegalSection[] = [
  {
    blocks: [
      { p: "Dante Alighieri Society Limited’s (“Dante”, “we” and “us” as the case may be) is committed to protecting and respecting your privacy. This privacy policy (“Privacy Policy”) describes what personal data we collect, how we will use that data and how we keep your data safe. For additional information on how we use cookies please refer to our Cookie Policy." },
      { p: "If you have a question that is not answered here, or if you would like more information about how we collect, use and store your personal data, you can contact us at any time by emailing at dantealighieri@ladante.cc." },
      { p: "Terms used in this Privacy Policy if defined under the Personal Data (Privacy) Ordinance, Cap 486 (“PDPO”) shall have the meanings attributed to them in the PDPO." },
    ],
  },
  {
    heading: "Purpose of the Privacy Policy",
    blocks: [
      { p: "This Privacy Policy applies to the processing of personal data and sets out the purposes for which your personal data collected in our premise(s), event(s), website(s) and/or online app(s) (all collectively the “Channels”) may be used following collection, including but not limited to all of the services that we offer (“Services”), what you are agreeing to with respect to Dante’s use of your personal data, to whom your personal data will be transferred, and your rights under the PDPO." },
    ],
  },
  {
    heading: "Personal Data We Hold",
    blocks: [
      { p: "Personal data held by Dante includes, but is not limited to, information such as common personal data (e.g. identifying data: name, surname, date of birth, place of birth, gender, nationality; contact data: e-mail address, telephone number, password, WeChat/WhatsApp/social media account(s), residence/domicile, delivery and/or billing address, age group, occupation, education and profession, personal interests etc.) which were collected from you directly, and also information such as payment details, purchase and payment records, marketing preferences, lifestyle data, and your use of our Channels (including web browsing data, IP address) that were gathered during the course of your dealings with Dante." },
    ],
  },
  {
    heading: "Collection of Personal Data",
    blocks: [
      { p: "For the purpose of carrying on our business, you may be requested to provide your personal data when you use our Channels, enrol for our products and/or Services, conduct gift redemption/cash or discount requests (if applicable), submit any comments or feedback to us, or when you are required to verify your identity with us." },
      { p: "Once you provide us with your personal data you are not anonymous to us." },
      { p: "When you use our online Channels we may use cookies and will record your visit only as a “hit”. The webserver makes a record of your visit that includes, inter alia, your IP addresses (and domain names), the types and configurations of browsers, language settings, geo-locations, operating systems, previous sites visited, and time/durations and the pages visited (visitor data). We use your personal data for the purpose of maintaining and improving our Channels." },
    ],
  },
  {
    heading: "Purpose for Collection of Personal Data",
    blocks: [
      { p: "Dante will collect and hold your personal data for, inter alia, the following main purposes:" },
      { list: [
        "for the provision of products and/or the Services and facilities by Dante/its service providers, who are engaged by us to assist in providing you with our products and/or Services and related activities (e.g. administrative and accounting activities, organisation and management of events, tailored services, customer and training services, logistic services, return services, anti-fraud checks etc.);",
        "for use of our Channels such as placing and holding your orders, registration offers, creating wish lists, email and push notifications; to improve our Channels and our promotions; to send you service messages such as any change to our terms and conditions or privacy policy, delivery updates or other non-marketing communications such as fraud prevention checks; and for carrying out your instructions or responding to your enquiry;",
        "hosting and managing events;",
        "customer service, general enquiries, research, market and statistical analysis/surveys for a better understanding of your needs, as well as designing or improving our products and/or Services;",
        "to maintain, update and/or process records of activities you have entered;",
        "to communicate with you;",
        "if you are a client of Dante or you gave us your consent, for direct marketing activities, including but not limited to postal marketing, email and SMS/MMS marketing, online personalised advertising, social media remarketing, social media insight, designing products and services for you, and marketing products or services in which Dante shall be involved;",
        "for profiling purposes, i.e. to analyse your personal data (e.g. geographical origin, gender, etc.), purchasing habits, preferences and interests and creating your profile;",
        "business administration and legal compliance in Hong Kong and/or other relevant jurisdictions, including any disclosure or notification requirements to which Dante or other classes of data recipients are subject;",
        "for forming part of our customer database necessary for the operation of the Services and/or products; and/or",
        "for observing any legal, governmental or regulatory requirements of Hong Kong or other relevant jurisdictions, including any disclosure.",
      ] },
      { p: "You are not required to provide the personal data requested. However, if you choose not to provide such data, Dante may not be able to provide certain products and/or services to you." },
    ],
  },
  {
    heading: "Change of Purpose",
    blocks: [
      { p: "We will only use your personal data for the purposes for which we collected it, or for a directly related purpose. If we need to use your personal data for an unrelated purpose, we will notify you and we will use it for such purpose subject to your prior voluntary and explicit consent." },
    ],
  },
  {
    heading: "Methods of Processing Personal Data",
    blocks: [
      { p: "The processing of personal data will take place with the use of paper-based and digital methods. For marketing and profiling purposes, the processing will take place in automated and telematic form (e-mail, WhatsApp, WeChat, text messages, automated call systems without operator) and/or traditional form (paper media, ordinary mail or non-automated telephone communication)." },
    ],
  },
  {
    heading: "Accuracy",
    blocks: [
      { p: "Dante will take all reasonable steps to ensure that the personal data collected are accurate. However, we expect you to use your best efforts to provide us with accurate personal data and/or to update any change in your personal data." },
    ],
  },
  {
    heading: "Cookies and Similar Technologies",
    blocks: [
      { p: "Our online Channels use certain cookies, web beacons, pixel tags, log files and other technologies. Please see our Cookie Policy to find out more about the cookies and other similar technologies we use." },
    ],
  },
  {
    heading: "Personal Data Transfer and Disclosure",
    blocks: [
      { p: "Unless instructed to the contrary upon collection of your personal data and/or upon receiving subsequent notice from you, we shall share your personal data for the purposes set out in this Privacy Policy, with our service providers and/or third parties, including but not limited to:" },
      { list: [
        "banks, credit card companies, and payment platforms which are offering payment services to us for facilitating Dante’s services that you have received and/or other payment providers;",
        "agents, service providers (including but not limited to IT services providers, delivery and courier companies etc.), and merchants (including but not limited to service providers, mailing houses, telecommunication companies, call centres and data processing companies);",
        "third party, organisation and/or partnership who assist us in the operation, organisation, administration and/or promotion of events, products and/or Services, including but not limited to Società Dante Alighieri;",
        "professional services firms, such as auditors, insurers, lawyers and accountants;",
        "law enforcement and/or other government and regulatory agencies or third parties as may be required; and/or",
        "social media and other online platforms including but not limited to WeChat, WhatsApp, Google, Facebook, LinkedIn, Instagram and YouTube.",
      ] },
      { p: "Please note that the foregoing is by way of example only and is not, nor should be intended to be, an exhaustive list, and there may be circumstances where we need to share personal data with other third parties to operate our Channels and/or to provide our products and/or Services." },
    ],
  },
  {
    heading: "Transfer of Personal Data outside of Hong Kong",
    blocks: [
      { p: "Where necessary, to operate our online Channels and to otherwise deliver our products and/or Services, we may transfer personal data to countries outside Hong Kong." },
      { p: "When transferring your personal data outside Hong Kong, we will comply with our legal and regulatory obligations about your personal data, including having a lawful basis for transferring personal data and putting appropriate safeguards in place to ensure an adequate level of protection for your personal data. We will take reasonable steps to ensure the security of your personal data in accordance with applicable data protection laws." },
      { p: "Although we are in Hong Kong and we do not have an establishment in the European Union (“EU”), if you are located in the EU and the General Data Protection Regulation (the “GDPR”) is deemed by relevant authorities to apply to your personal data which you have provided to us, you also, in addition to the rights set out in this Privacy Policy, have the following rights:" },
      { list: [
        "to lodge a complaint about our processing of your personal data with your local data protection authority;",
        "to request erasure of your personal data, provided it is no longer required for the purpose for which we collected it;",
        "to restrict the processing of your personal data in those circumstances specified within the GDPR; and",
        "to be provided with a copy of your personal data held by us.",
      ] },
    ],
  },
  {
    heading: "Retention of Personal Data",
    blocks: [
      { p: "Your personal data will only be retained for as long as is necessary to fulfil the purpose for which it was collected, unless contrary to any applicable statutory requirement or unless the retention is otherwise permitted or required by laws, rules and/or regulations." },
    ],
  },
  {
    heading: "Direct Marketing",
    blocks: [
      { p: "If you are a customer of Dante or if you have given us your consent, we collect and process your personal data for direct marketing activities." },
      { p: "We will use your name and contact details (such as telephone number, email address, WeChat/WhatsApp number, social media account(s), and/or correspondence address) and the other personal data mentioned above for marketing purposes — i.e. to send newsletters and commercial communications relating to Dante’s products and/or Services through various communication means such as direct mail, email, telephone, SMS, WeChat/WhatsApp messages, newsletters, brochures and leaflets; and/or to invite you to exclusive events; and/or to carry out surveys." },
    ],
  },
  {
    heading: "Confidentiality and Security of your Personal Data",
    blocks: [
      { p: "We are committed to keeping your personal data secure and we will take reasonable precautions to protect your personal data from loss, misuse, unauthorised access and/or alteration." },
    ],
  },
  {
    heading: "Right to Access and Correct your Information",
    blocks: [
      { p: "You have the right to:" },
      { list: [
        "know whether we hold any of your personal data and, if so, access and check the same;",
        "full control and ability to correct or edit your personal data at any time;",
        "request us to delete or remove your personal data in some circumstances; and",
        "request us to block or suppress the processing of your personal data in certain circumstances.",
      ] },
      { p: "You may wish to contact us via e-mail to dantealighieri@ladante.cc or via post to Room 702, 7/F, Hong Kong Arts Centre, 2 Harbour Road, Wanchai, Hong Kong. We will, upon being satisfied of the authenticity and validity of your request, make every endeavour to comply with and respond to your request." },
    ],
  },
  {
    heading: "Amendments to this Privacy Policy",
    blocks: [
      { p: "We may amend this Privacy Policy, at our sole and absolute discretion, from time to time. If we make any substantial amendments to this Privacy Policy, we will notify you by posting an appropriate announcement on our Channels. Such posting shall constitute sufficient and adequate notice to you of the amendments. By continuing to use our Channels, products and/or Services after such amendment, you unconditionally accept and agree to be bound by the amended Privacy Policy." },
    ],
  },
];

export const cookieSections: LegalSection[] = [
  {
    blocks: [
      { p: "The terms and conditions of this Cookie Policy have to be carefully reviewed in conjunction with our Terms and Conditions and Privacy Policy." },
      { p: "Capitalised terms used herein shall have the same meaning as those set out in the Terms and Conditions unless otherwise defined." },
    ],
  },
  {
    heading: "Use of Cookies",
    blocks: [
      { p: "Dante Alighieri Society Limited uses automatic systems of data collection, such as cookies. Cookies are small text files/devices that are stored on / transmitted to your device when you visit certain websites, for record-keeping or other administrative purposes, including the Site. Any information in the Cookie that is classed as Personal Data is managed according to our Privacy Policy." },
    ],
  },
  {
    heading: "Types of Cookies",
    blocks: [
      { p: "These are the types of Cookies which we may use on our Site:" },
      { list: [
        "Essential: the cookies used, inter alia, in relation to the Services or to keep the Site secure. If you choose to disable all cookies in your browser the Site may no longer be accessible on that browser. As these cookies are strictly necessary to provide the Services, and to keep your online data secure, these types of cookies are automatically enabled.",
        "Performance: the cookies used to report on the usage of the Site and any problems that occur when using it.",
        "Enhanced: the cookies used to reflect your preferences as well as improve your browsing experience.",
        "Social Media and Advertising: the cookies used to tailor adverts on other websites and to measure how well our adverts are performing.",
      ] },
    ],
  },
  {
    heading: "How to Manage Cookies",
    blocks: [
      { p: "You can manage your cookies in your browser settings. Most browsers are automatically set to accept cookies, however you can alter the settings of your browser to prevent automatic acceptance. Please be aware that completely disabling cookies may restrict your access to the Site." },
    ],
  },
];
