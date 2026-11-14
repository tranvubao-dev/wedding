/**
 * Wedding Invitation Configuration
 * Chỉnh sửa các trường bên dưới để thay đổi toàn bộ thông tin thiệp cưới
 * @license SPDX-License-Identifier: Apache-2.0
 */

export const WEDDING_CONFIG = {
  // ===== LIÊN KẾT GỬI KHÁCH =====
  sharing: {
    baseUrl: 'https://bidtech.id.vn/', // Địa chỉ đã deploy; không gửi link localhost
  },

  // ===== QUÀ MỪNG =====
  gifts: {
    enabled: true,
    bride: { demo: false, bankName: 'BIDV', accountName: '', accountNumber: '' },
    groom: { demo: false, bankName: 'TPBank', accountName: '', accountNumber: '' },
  },

  // ===== HIỆU ỨNG =====
  effects: {
    snow: {
      enabled: true, // Đổi false để tắt tuyết rơi
      count: 25, // Số bông tuyết, tối đa 40; điện thoại hiển thị tối đa 14
    },
  },

  // ===== NHẠC NỀN =====
  audio: {
    backgroundMusic:
      'https://res.cloudinary.com/dp2vpbmjg/video/upload/v1781189747/wedding_murjqb.mp3',
    volume: 0.35, // Âm lượng từ 0 đến 1
    loop: true, // Lặp lại nhạc nền
  },

  // ===== FONT CHỮ =====
  fonts: {
    // Khi đổi font Google, cập nhật cả tên font bên dưới và URL tải font.
    stylesheetUrl:
      'https://fonts.googleapis.com/css2?family=Corinthia:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Noto+Serif:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,700&display=swap',
    sans: '"Noto Serif", Georgia, serif', // Nội dung theo phong cách thiệp giấy
    serif: '"Cormorant Garamond", Georgia, serif', // Tiêu đề thanh mảnh
    coupleNames: '"Corinthia", cursive', // Giữ font tên cô dâu và chú rể
    mono: '"Noto Serif", Georgia, serif', // Ngày tháng và số liệu
  },

  // ===== HÌNH ẢNH =====
  // Album: content.albumImages. Ảnh bản đồ: guestSchedules.*.receptionImagemap.
  images: {
    qrBride: './qr-nhu.svg', // Đặt ảnh QR thật của cô dâu trong public/
    qrGroom: './qr-bao.svg', // Đặt ảnh QR thật của chú rể trong public/
    paperTexture: './ivory-paper.svg', // Vân giấy ivory nhẹ
    monogram: './wedding-monogram.webp', // Logo NB dạng nét liền
    stationeryFlowers: './dried-flower.webp', // Họa tiết hoa khô nền thiệp
    // Ảnh bìa thiệp mời
    invitationHero:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBHxG9Nwno9b7LenxKfrpFGEXk4JLb26izVgt2ncC9i-0PI6G3xXB11tXH3G_MnYkGzqACTyLXfCbgaRT3_BW2K15dXSX4eWmJ6F9H96mjJuHJMIbsynBa7qtdkArAacdwvnvp8odB8p6-FVmw3HM0zhvG3eNH4vyXwf100eGPyLGuiLj9Ks-jAr7fSnyYe2QLbeA0dmxOzAi-j-x52FnvfQqjZXcO3at3Ud9b16dbqZIY-1w8nzsQT4vzAbAXS0vh1s2W_S9o3ZpLk',
    // Ảnh chân dung trong thiệp mời
    invitationPortrait:
      'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427569/8_rnbon0.png',
    // Ảnh bìa trang chi tiết sự kiện
    eventHero:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCZCAPgrkcckoBn0ZMxlI_BwFvTbQ1fOGiVVhjlyc9pgUJX-N8ZOziPHpHjQibkF_Kbg1RXg_dWBFiO5r_LDb4oKFrJMKEXXPACEocsz7KD8_tTLvV0juhr8EG48C6EGt9jjNkGkf9BznvNdXYW6TMu3Cn4uWDd7emBYa2Uzh1UmuUSKLUMy4jvCKFAi8ZaZLij7Z3UoDmdPju08VYTQ5mTvADAlG-_npDSxbDe2f__COsjGLXdGO_xkNMXrMGIGDwioLGya4Wo4bbT',
    // Ảnh minh họa thiệp ở trang RSVP
    rsvpInvitation:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCmdBs_xCbji6DgBxFvKI7kY1r3f_sezJzSF1mpquWjJYQCgLOFjKwheKP8l877RaFIhkWpzcWZEV99s-yUwlAaS4UALpXiakMkixmAzuxczwF15WmcOyRRNmTv3W1Zmoq9SBW40NsWjJ8cAAfna3SW0VxL_5u8vMXu-B-laOIMmwCF4VxGM2xHRPH-kIf_D6J0b6Wp6SU1X34EOvLW0kNUILiQMsa48kncxLejLnYpmXa82-yKj5Fc_OjG__UOkB0_QX0nY7VpeRCp',
    // Ảnh minh họa bàn tiệc ở trang RSVP
    rsvpReception:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCxtPg_JvmaahWep_lcMyb1nHIokXnxD1vqsNeG_rLQ496DttrrNsDoWofnz-ljP06KZuOOsBnmPOw31owCbH9k4YYGFRZ8_yLgnqflQ8IHOBinWKg5HNBsZAZ6Jb-a3xaKawjATkpc5iKowlyZvmD-6YffhV8rRdnF6IXvac2v8KjGWLGUV1YkBynKOGxdUDWqXYpInIhLeQ5TtOo4eQgs1-MzNs-pWVC_CIYYXZ98NGw1FOidDR6yYEz8d3PIm8fJfjYfz2fMYvL4',
    // Ảnh minh họa trang quản lý khách
    adminPreview:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBp3Tju2h4uCePrj_jT2mocgw3d3oEq8f3O2uYp1yyO2_JQDbRrCVqAKowDO5Af1mmB7GKD9EW3Y5LivMXtIUoL1A5JvhZqC4e0NYzu6MXHlUCYNH_KNo2goNxmr0YnMI7WU_RTggHbK4-mip4SGnxVoMoDmn-UMq2FtYmwvHzEI5PV9At-5aajUplwwE2_jONdoaJI3INXSeQnhfsaZe7Jo31CM4-CBV2pszI12DJ6qE0GO_G6ufwEjtAkA2BCuweuAE_r7_R4G-Wi',
  },

  // ===== CẶP ĐÔI =====
  couple: {
    brideName: 'Quỳnh Như',
    groomName: 'Vũ Bảo',
  },

  // Lịch trình riêng theo nhóm khách. Mỗi nhóm có thể chỉnh giờ độc lập.
  guestSchedules: {
    groom: {
      invitationTitle: 'Lễ Thành Hôn',
      dateLine: 'Thứ Tư | 6 . 1 . 2027',
      lunarDate: 'Ngày âm lịch: 29 tháng 11',
      countdownTarget: '2027-01-06T10:00:00',
      ceremonyTitle: 'Lễ Thành Hôn',
      ceremonyTimeLabel: 'Làm lễ chính thức tại Nhà Trai',
      ceremonyTime: '10:00',
      ceremonyDate: '06/01/2027',
      ceremonyDateIso: '2027-01-06',
      ceremonyVenueName: 'Nhà Trai',
      ceremonyAddress: '409 Lạc Long Quân, Quy Nhơn Bắc, Gia Lai',
      receptionTitle: 'Tiệc Cưới Trân Trọng Kính Mời',
      receptionArrivalTime: '17:15',
      receptionTime: '18:00',
      receptionDate: '06/01/2027',
      receptionDateIso: '2027-01-06',
      receptionVenueName: 'Nhà Hàng Tiệc Cưới Hoàng Long 2',
      receptionAddress: 'Ngã ba cầu ông Đô, Quốc lộ 1A, Diêu Trì, Tuy Phước, Gia Lai',
      receptionAddressMap:
        'https://www.google.com/maps/place/Nh%C3%A0+H%C3%A0ng+Ti%E1%BB%87c+C%C6%B0%E1%BB%9Bi+Ho%C3%A0ng+Long+2/@13.8192307,109.1474105,319m/data=!3m1!1e3!4m14!1m7!3m6!1s0x316f1500234927ff:0xf4533b977938e720!2zTmjDoCBIb8OgbmcgVGnhu4djIEPGsOG7m2kgSG_DoG5nIExvbmcgUGFsYWNl!8m2!3d13.8187551!4d109.1468825!16s%2Fg%2F11x8ylnpmw!3m5!1s0x316f14f146c16449:0xcbedd71ff95cbf5b!8m2!3d13.819108!4d109.1471325!16s%2Fg%2F11b67npvsj?entry=ttu&g_ep=EgoyMDI2MTEwNC4wIKXMDSoASAFQAw%3D%3D',
      receptionImagemap:
        'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793450637/Screenshot_2026-10-31_at_19.43.43_rvvpxb.png',
      programSections: ['day2', 'reception'],
    },
    bride: {
      invitationTitle: 'Lễ Vu Quy',
      dateLine: 'Thứ Tư | 16 . 12 . 2026',
      lunarDate: 'Ngày âm lịch: 8 tháng 11',
      countdownTarget: '2026-12-16T10:00:00',
      ceremonyTitle: 'Lễ Vu Quy',
      ceremonyTimeLabel: 'Nghi thức Nạp lễ tại Nhà Gái',
      ceremonyTime: '10:00',
      ceremonyDate: '16/12/2026',
      ceremonyDateIso: '2026-12-16',
      ceremonyVenueName: 'Nhà Gái',
      ceremonyAddress: 'Phước Thành, Tuy Phước Tây (Thôn Bình An 2)',
      receptionTitle: 'Tiệc đãi khách nhà gái',
      receptionArrivalTime: '11:00',
      receptionTime: '11:00',
      receptionDate: '16/12/2026',
      receptionDateIso: '2026-12-16',
      receptionVenueName: 'Nhà Gái',
      receptionAddress: 'Phước Thành, Tuy Phước Tây (Thôn Bình An 2)',
      receptionAddressMap:
        'https://www.google.com/maps/@13.7722041,109.1010837,107m/data=!3m1!1e3?entry=ttu&g_ep=EgoyMDI2MTAyOC4wIKXMDSoASAFQAw%3D%3D',
      receptionImagemap:
        'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793507587/Screenshot_2026-11-01_at_11.32.34_xsatnc.png',
      programSections: ['day1'],
    },
  },

  // Nội dung chương trình dùng chung trên trang chi tiết, hiển thị theo nhóm thiệp.
  program: {
    day1: {
      title: 'LỄ ĂN HỎI & LỄ VU QUY',
      dateText: 'Thứ Tư, 16/12/2026 (Nhằm ngày 08/11 NĂM BÍNH NGỌ)',
      events: [
        {
          time: '10:00',
          title: 'Lễ Ăn Hỏi',
          location: 'Tư gia nhà gái - Thôn Bình An 2, Phước Thành, Tuy Phước',
        },
        {
          time: '11:00',
          title: 'Tiệc Mừng Vu Quy',
          location: 'Tư gia nhà gái - Thôn Bình An 2, Phước Thành, Tuy Phước',
        },
      ],
    },
    day2: {
      title: 'LỄ RƯỚC DÂU & LỄ THÀNH HÔN',
      dateText: 'Thứ Tư, 06/01/2027 (Nhằm ngày 29/11 Âm lịch)',
      events: [
        {
          time: '07:00',
          title: 'Lễ Xin Dâu',
          location: 'Tư gia nhà gái - Thôn Bình An 2, Phước Thành, Tuy Phước',
        },
        {
          time: '10:00',
          title: 'Lễ Thành Hôn',
          location: 'Tư gia nhà trai - 409 Lạc Long Quân, Quy Nhơn Bắc, Gia Lai',
        },
      ],
    },
    reception: {
      title: 'PHẦN 3: TIỆC CƯỚI TRÂN TRỌNG KÍNH MỜI',
      dateText: 'Ngày âm lịch: 29 tháng 11 | Ngày dương lịch: 06/01/2027',
      events: [
        {
          time: '17:15',
          title: 'Đón khách chúc mừng',
          location: 'Nhà Hàng Tiệc Cưới Hoàng Long 2',
        },
        {
          time: '18:00',
          title: 'Khai mạc & Nhập tiệc chính thức',
          location: 'Nhà Hàng Tiệc Cưới Hoàng Long 2',
        },
      ],
    },
  },

  // ===== MÃ MÀU CHỦ ĐẠO =====
  colors: {
    primary: '#5e5948', // Nâu olive, đồng bộ mẫu thiệp
    accent: '#95786c', // Rose gold trầm
    background: '#e9e5da', // Nền giấy ấm, tương phản với khung thiệp
    paper: '#f9f7ef', // Nền khung thiệp và biểu mẫu
    soft: '#efebe1', // Nền phân khu
    ink: '#393a32', // Nội dung chính
    muted: '#626256', // Nội dung phụ
    border: '#bbb095', // Viền giấy
    coupleNames: '#68604a', // Mực olive cho tên cô dâu và chú rể
    metallicLight: '#ead0c2', // Điểm sáng rose gold
    metallicDark: '#79584b', // Cạnh kim loại
    gold: '#c2ae7c', // Logo và đường nét champagne
  },

  // ===== TOÀN BỘ NỘI DUNG HIỂN THỊ =====
  copy: {
    gifts: {
      button: 'Gửi quà mừng',
      close: 'Khép lại hộp quà',
      eyebrow: 'MỘT CHÚT YÊU THƯƠNG',
      title: 'Hộp quà hạnh phúc',
      thankYou:
        'Sự hiện diện và những lời chúc của bạn đã là món quà quý giá với chúng mình. Nếu bạn muốn gửi thêm một chút yêu thương, chúng mình xin đón nhận bằng tất cả sự trân trọng. Cảm ơn bạn đã cùng vun đắp cho khởi đầu hạnh phúc của hai đứa.',
      footer: 'Thương mến và biết ơn,',
      bride: 'Mừng cô dâu',
      groom: 'Mừng chú rể',
      scan: 'Quét mã để gửi quà mừng',
      demo: 'QR mẫu — chưa dùng chuyển khoản',
      unavailable: 'Mã QR đang được cập nhật',
      accountName: 'Chủ tài khoản',
      accountNumber: 'Số tài khoản',
    },
    experience: {
      openingEyebrow: 'MỘT LỜI MỜI TỪ TRÁI TIM',
      openInvitation: 'Mở thiệp mời',
      openingNote: 'Chạm để mở thiệp và thưởng thức nhạc nền',
      replayInvitation: 'Xem lại lời mời',
      portraitEyebrow: 'CHÚNG MÌNH, TỪ NAY VỀ SAU',
      closingMessage: 'Cảm ơn bạn đã là một phần trong ngày hạnh phúc của chúng mình.',
      albumNav: 'Album',
      wishesNav: 'Lời chúc',
    },
    app: {
      brand: 'Wedding',
      pageTitle: 'Wedding',
      footerCopyright: '© 2026 Timeless Romance Wedding. Designed for Elegance.',
      privacy: 'Privacy Policy',
      contact: 'Contact Support',
      footerQuote: 'Let Love lead your way',
      footerBrand: 'Eternal Elegance Co.',
      pauseMusicTitle: 'Tạm dừng nhạc nền',
      playMusicTitle: 'Bật nhạc nền lãng mạn',
    },
    common: {
      guest: 'Quý Khách',
      bride: 'CÔ DÂU',
      groom: 'CHÚ RỂ',
      calendar: 'Thêm vào Google Calendar',
      confirm: 'Xác nhận',
      skip: 'Bỏ qua',
    },
    navigation: {
      menuLabel: 'WEDDING MENU',
      invitation: 'Thiệp Mời',
      details: 'Chi Tiết Sự Kiện',
      rsvp: 'Xác Nhận Tham Dự',
      guests: 'Quản Lý Khách',
      drawerClose: 'Đóng menu điều hướng',
    },
    adminLogin: {
      title: 'Đăng Nhập Quản Trị Viên',
      description:
        'Khu vực này chỉ dành cho cô dâu & chú rể để quản lý danh sách khách mời. Vui lòng đăng nhập bằng email và mật khẩu quản trị.',
      pinLabel: 'MẬT KHẨU',
      pinPlaceholder: 'Nhập mật khẩu...',
      wrongPin: 'Mã số PIN không đúng. Vui lòng kiểm tra lại!',
      hint: 'Tài khoản cần được cấp quyền quản trị.',
      close: 'Đóng popup đăng nhập',
      loginSuccess: 'Đăng nhập Quản trị viên thành công!',
      logout: 'Đã đăng xuất khỏi quyền Quản trị viên',
      adminButton: 'Admin',
      logoutButton: 'Thoát',
      loginTitle: 'Đăng nhập Quản trị viên',
    },
    invitationView: {
      invitationTo: 'Trân Trọng Kính Mời',
      seeDetails: 'Xem Chi Tiết Lễ Cưới',
      quickRsvp: 'Xác Nhận Tham Dự',
      scrollAlbum: 'Cuộn Xuống Xem Album',
      countdownEyebrow: 'ĐẾM NGƯỢC THỜI GIAN CHUNG ĐÔI',
      countdownTitle: 'Khoảnh khắc đáng mong chờ nhất',
      days: 'Ngày',
      hours: 'Giờ',
      minutes: 'Phút',
      seconds: 'Giây',
      albumEyebrow: 'ALBUM KỈ NIỆM',
      albumTitle: 'Khoảnh khắc lưu giữ tình yêu',
      albumDescription:
        'Được ghi lại qua lăng kính lãng mạn vô biên của buổi dạo chơi hạnh phúc. Nhấp vào ảnh để phóng to và lướt xem album.',
      viewPortrait: 'VIEW PORTRAIT',
      closeAlbum: 'Đóng album ảnh',
      previousImage: 'Hình trước',
      nextImage: 'Hình tiếp theo',
      memoryEyebrow: 'KHOẢNH KHẮC',
      memoryTitle: 'Hành trình tình yêu',
      timeLabel: 'THỜI GIAN',
      receptionArrivalLabel: 'Đón khách',
      venueLabel: 'ĐỊA ĐIỂM',
      mapButton: 'Mở Bản Đồ Đường Đi',
      loveQuote:
        'Tình yêu không phải là nhìn nhau, mà là cùng nhìn về một hướng. Chúng tôi trân trọng kính mời bạn đến chung vui trong khoảnh khắc khởi đầu hành trình mới này.',
      wishesEyebrow: 'WISHING WALL',
      wishesTitle: 'Bức Tường Chúc Phúc',
      wishesDescription:
        'Nơi lưu giữ những lời chúc lãng mạn, ấm áp, gửi gắm từ bạn bè, thân hữu dành cho cô dâu & chú rể.',
      noWishes: 'Chưa có lời chúc nào. Hãy là người đầu tiên chúc phúc cho đôi uyên ương!',
      guestFallback: 'Khách mời',
      newWish: 'Mới gửi',
      unlike: 'Bỏ thích',
      like: 'Thích lời chúc',
      wishFormTitle: 'Gửi Lời Chúc Hạnh Phúc',
      wishFormDescription:
        'Hãy viết lại lời tâm tình tuyệt vời của bạn dành cho Quỳnh Như & Vũ Bảo làm kỉ niệm lưu trữ mãi mãi.',
      nameLabel: 'Họ & Tên',
      namePlaceholder: 'Họ và tên của bạn...',
      wishLabel: 'Lời Chúc Của Bạn',
      wishPlaceholder: 'Nhập lời chúc hạnh phúc...',
      sendWish: 'Gửi Lời Chúc',
      rsvpTitle: 'Bạn sẽ tham dự chứ?',
      rsvpDescription:
        'Vui lòng phản hồi trước ngày 15/12 để chúng tôi chuẩn bị đón tiếp một cách chu đáo tốt nhất.',
      rsvpSuccessTitle: 'Cảm ơn phản hồi của bạn!',
      rsvpSuccessDescription:
        'Thông tin phản hồi đã được cập nhật thành công vào danh sách khách mời quan trọng.',
      rsvpNamePlaceholder: 'Họ và tên của bạn',
      attending: 'THAM DỰ',
      notAttending: 'KHÔNG THỂ',
      partySize: 'SỐ NGƯỜI ĐI CÙNG (GỒM CẢ BẠN)',
      sendRsvp: 'Gửi Phản Hồi Tham Dự',
      altHero: 'Ảnh cưới của Vũ Bảo và Quỳnh Như',
    },
    detailsView: {
      heroAlt: 'Ảnh bìa địa điểm tổ chức tiệc cưới',
      title: 'Thông Tin Sự Kiện',
      intro:
        'Hân hạnh kính mời quý khách tới chung vui và chứng kiến khoảnh khắc trọng đại của đôi lứa.',
      ceremonyType: 'NGHI LỄ GIA TIÊN',
      receptionType: 'CHUNG VUI NGÀY HẠNH PHÚC',
      locationBadge: 'ĐỊA ĐIỂM SANG TRỌNG',
      locationTitle: 'Địa Điểm Tổ Chức',
      // venueType: 'RESTAURANT & LOUNGE',
      addressLabel: 'ADDRESS',
      directions: 'Chỉ Đường',
      rsvp: 'Xác nhận tham dự',
      mapAlt: 'Bản đồ vị trí địa điểm tổ chức tiệc cưới',
      timelineEyebrow: 'TIMELINE',
      timelineTitle: 'Chương Trình Buổi Lễ',
      groupScheduleLabel: 'Lịch trình dành cho',
      guestArrivalLabel: 'Đón khách',
      receptionScheduleLabel: 'Khai tiệc',
      calendarDurationMinutes: 120,
    },
    rsvpView: {
      eyebrow: 'RSVP',
      title: 'Sự Hiện Diện Của Bạn',
      intro:
        'Chúng tôi vô cùng hạnh phúc khi được đón tiếp bạn trong ngày trọng đại này. Hãy giúp chúng tôi chuẩn bị chu đáo nhất bằng cách xác nhận thông tin dưới đây.',
      name: 'Họ tên của bạn',
      namePlaceholder: 'Nhập tên đầy đủ của bạn...',
      attendanceQuestion: 'Bạn có tham dự tiệc cưới không?',
      attendingChoice: 'Tôi sẽ tham dự',
      declinedChoice: 'Rất tiếc, tôi không thể tham dự',
      partySize: 'Số người đi cùng',
      alone: 'Chỉ mình tôi',
      plusOne: '+ 1 người',
      plusTwo: '+ 2 người',
      family: 'Cả gia đình',
      relation: 'Bạn là khách của...',
      blessing: 'Lời nhắn gửi yêu thương',
      blessingPlaceholder: 'Viết lời chúc của bạn tại đây để gửi tới đôi uyên ương...',
      submit: 'GỬI XÁC NHẬN THAM DỰ',
      successAttendingTitle: 'Đã ghi nhận xác nhận tham dự!',
      successAttendingDescription:
        'Cảm ơn bạn đã xác nhận. Chúng tôi mong được đón tiếp bạn trong ngày trọng đại.',
      successAttendingFooter: 'Hẹn gặp bạn tại buổi lễ!',
      successDeclinedTitle: 'Đã ghi nhận phản hồi của bạn',
      successDeclinedDescription:
        'Rất tiếc vì bạn không thể tham dự. Cảm ơn bạn đã gửi lời hồi đáp và lời chúc đến đôi uyên ương.',
      successDeclinedFooter: 'Chúc bạn mọi điều tốt đẹp!',
      image1Alt: 'Bộ thiệp cưới sang trọng',
      image2Alt: 'Bàn tiệc cưới được bày biện trang nhã',
    },
    adminView: {
      title: 'Guest Management',
      description:
        'Tạo thiệp cưới kỹ thuật số cá nhân hóa, theo dõi phản hồi thời gian thực (RSVP) và quản lý danh sách khách mời của bạn một cách sang trọng và trơn tru.',
      addTitle: 'Add New Guest',
      name: 'Full Name',
      namePlaceholder: 'Ví dụ: Mr. & Mrs. Alexander Smith',
      group: 'Nhóm khách mời',
      groupPlaceholder: 'Chọn nhóm thiệp mời',
      groupOptions: ['NHÀ TRAI', 'NHÀ GÁI'],
      legacyBrideGroups: ['HỌ NHÀ GÁI', 'BẠN CÔ DÂU', 'BRIDESMAID'],
      legacyGroomGroups: ['HỌ NHÀ TRAI', 'BẠN CHÚ RỂ'],
      create: 'TẠO THIỆP CÁ NHÂN',
      themeTitle: 'Tùy Chỉnh Tone Màu Thiệp',
      themeDescription:
        'Thay đổi toàn bộ tông màu sắc chủ đạo của thiệp mời trực tuyến này đại diện cho phong cách lễ cưới đặc trưng của cặp đôi.',
      themePresetsLabel: 'Gợi Ý Tone Màu Lễ Cưới Đẹp',
      customColorLabel: 'Tự Chọn Mã Màu Của Bạn',
      primaryColor: 'Tone Màu Chủ Đạo',
      accentColor: 'Màu Điểm Nhấn',
      themeHint:
        '💡 Gợi ý: Sắc thái mới sẽ được lưu lại làm giao diện mặc định. Hãy kéo chọn màu và quan sát toàn bộ trang thay đổi trực quan tức thì!',
      invitationsMetric: 'GUEST INVITATIONS',
      attendingInvitationsSummary: 'thiệp xác nhận tham dự',
      peopleAttendingMetric: 'NGƯỜI DỰ TIỆC',
      peopleAttendingDescription: 'Tổng số người, tính cả khách mời và người đi cùng',
      partySizeColumn: 'Số người dự tiệc',
      peopleUnit: 'người',
      notConfirmedCount: '—',
      responseMetric: 'RESPONSE STATUS',
      responded: 'of',
      respondedSuffix: 'guests responded',
      listTitle: 'Danh sách thiệp mời',
      searchPlaceholder: 'Tìm tên khách...',
      allGroups: 'Tất cả',
      guestColumn: 'Khách mời',
      groupColumn: 'Nhóm',
      statusColumn: 'Trạng thái',
      actionsColumn: 'Hành động',
      attending: 'Tham gia',
      declined: 'Không thể',
      pending: 'Chưa Trả Lời',
      copyLink: 'Copy Link',
      copyLinkTitle: 'Sao chép liên kết cá nhân',
      preview: 'Xem trước',
      previewTitle: 'Xem trước thiệp mời',
      deleteTitle: 'Xóa khách mời',
      noResults: 'Không tìm thấy khách mời phù hợp',
      listFooter: 'Quản lý chính xác • Tạo ấn tượng tinh tế nhất tới người thân thương',
      presets: [
        {
          name: 'Ivory · Rose Gold (Gốc)',
          tone: '#5e5948',
          accent: '#95786c',
          desc: 'Giấy ivory, mực olive và rose gold',
        },
        { name: 'Đỏ Nồng Ấm', tone: '#861719', accent: '#bd4549', desc: 'Sâu lắng lãng mạn' },
        { name: 'Xanh Thảo Mộc', tone: '#235338', accent: '#4ca572', desc: 'Tự nhiên thiên nhiên' },
        { name: 'Lam Sapphire', tone: '#1c395c', accent: '#477ea5', desc: 'Xanh cao quý quý phái' },
        { name: 'Tím Chung Thủy', tone: '#4d1e52', accent: '#95499e', desc: 'Quyến rũ thủy chung' },
        { name: 'Cam Đất Ấm', tone: '#a04321', accent: '#d37553', desc: 'Hoàng hôn hiện đại' },
      ],
    },
    toast: {
      guestAdded: 'Đã thêm khách mời "{name}" thành công!',
      guestDeleted: 'Đã xóa khách mời "{name}"',
      rsvpAttending: 'Đã nhận xác nhận tham dự của {name}!',
      rsvpReceived: 'Đã nhận phản hồi của {name}',
      rsvpTabReceived: 'Đã ghi nhận phản hồi RSVP của {name}.',
      blessingAdded: 'Cảm ơn bạn đã gửi lời chúc ý nghĩa của mình!',
      previewGuest: 'Đang hiển thị thiệp mời cho: {name}',
      copiedGuestLink: 'Đã sao chép liên kết cho khách: {name}',
    },
    accessibility: {
      toggleNavigation: 'Mở menu điều hướng',
      coupleRings: 'Nhẫn cưới trên đôi tay đan vào nhau',
    },
    decoration: {
      flower: '✿',
      dove: '🕊️',
    },
    logs: {
      autoplayBlocked: 'Autoplay blocked. Background music will start on first user interaction.',
      audioPlayFailed: 'Audio play blocked or failed:',
      guestsParseFailed: 'Failed to parse guests from localStorage',
      clipboardFailed: 'Failed to copy to clipboard',
    },
  },

  // ===== DỮ LIỆU CHỮ MẪU =====
  content: {
    initialGuests: [
      {
        id: 'g1',
        name: 'Mr. & Mrs. Julian Thorne',
        group: 'NHÀ GÁI',
        status: 'SENT',
        rsvpStatus: 'ATTENDING',
        guestsCount: 2,
        relation: 'BRIDE',
        blessing:
          'Chúc mừng hạnh phúc hai cháu! Chúc hai cháu trăm năm hạnh phúc, răng long đầu bạc!',
        updatedAt: '2026-05-28T12:00:00Z',
      },
      {
        id: 'g2',
        name: 'Miss Elena Rodriguez',
        group: 'NHÀ GÁI',
        status: 'DRAFT',
        rsvpStatus: 'PENDING',
        guestsCount: 1,
        relation: 'BRIDE',
        blessing: '',
        updatedAt: '',
      },
      {
        id: 'g3',
        name: 'The Kensington Family',
        group: 'NHÀ TRAI',
        status: 'SENT',
        rsvpStatus: 'ATTENDING',
        guestsCount: 4,
        relation: 'GROOM',
        blessing: 'Best wishes to both of you on this special journey of life. Congratulations!',
        updatedAt: '2026-05-28T14:30:00Z',
      },
      {
        id: 'g4',
        name: 'Gia đình Bác Huỳnh & Bác Minh',
        group: 'NHÀ TRAI',
        status: 'SENT',
        rsvpStatus: 'ATTENDING',
        guestsCount: 2,
        relation: 'GROOM',
        blessing: 'Rất hạnh phúc được chia vui cùng hai cháu và hai gia đình.',
        updatedAt: '2026-05-27T09:15:00Z',
      },
      {
        id: 'g5',
        name: 'Anh Tuấn (Bạn Thân Đại Học)',
        group: 'NHÀ TRAI',
        status: 'SENT',
        rsvpStatus: 'ATTENDING',
        guestsCount: 1,
        relation: 'GROOM',
        blessing: 'Chúc ông bạn lấy vợ hạnh phúc nhé, mãi đỉnh!',
        updatedAt: '2026-05-29T01:10:00Z',
      },
      {
        id: 'g6',
        name: 'Chị Mai Phương (Đồng nghiệp phòng Marketing)',
        group: 'NHÀ GÁI',
        status: 'SENT',
        rsvpStatus: 'DECLINED',
        guestsCount: 0,
        relation: 'BRIDE',
        blessing:
          'Do có lịch công tác đột xuất khó dời nên mình không thể tham dự được, xin gửi lời chúc trăm năm hạnh phúc đến Quỳnh Như và Vũ Bảo nhé!',
        updatedAt: '2026-05-29T02:00:00Z',
      },
    ],
    albumImages: [
      {
        id: 'img1',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427660/30_io1za0.png',
        caption: 'Những ngày đầu tiên bên nhau, hạnh phúc ngập tràn trong ánh mắt và nụ cười',
      },
      {
        id: 'img2',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427656/29_v2bsg8.png',
        caption: 'Từng bước đi chung lối kể từ hôm nay',
      },
      {
        id: 'img3',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427652/28_z86uv3.png',
        caption: 'Nụ cười rạng ngời hạnh phúc trăm năm',
      },
      {
        id: 'img4',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427647/27_by2kta.png',
        caption: 'Vẻ đẹp cô dâu tinh khôi trong ngày cưới',
      },
      {
        id: 'img5',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427643/26_wpiznk.png',
        caption: 'Hôn lễ khởi đầu cho hành trình lãng mạn mới',
      },
      {
        id: 'img6',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427618/20_nm8dhe.png',
        caption: 'Khoảnh khắc trao nhẫn hạnh phúc',
      },
      {
        id: 'img7',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427622/21_vftpwf.png',
        caption: 'Hôn lễ khởi đầu cho hành trình lãng mạn mới',
      },
      {
        id: 'img8',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427557/5_zm5sty.png',
        caption: 'Khoảnh khắc trao nhẫn hạnh phúc',
      },
      {
        id: 'img9',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427548/3_b1kqsb.png',
        caption: 'Hôn lễ khởi đầu cho hành trình lãng mạn mới',
      },
      {
        id: 'img10',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427542/1_vego69.png',
        caption: 'Khoảnh khắc trao nhẫn hạnh phúc',
      },
      {
        id: 'img11',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427573/9_tczo62.png',
        caption: 'Khoảnh khắc trao nhẫn hạnh phúc',
      },
      {
        id: 'img12',
        url: 'https://res.cloudinary.com/dp2vpbmjg/image/upload/v1793427585/12_rq08ev.png',
        caption: 'Hôn lễ khởi đầu cho hành trình lãng mạn mới',
      },
    ],
  },
} as const;
