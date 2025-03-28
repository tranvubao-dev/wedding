import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

void main() {
  runApp(const WeddingInvitationApp());
}

class WeddingInvitationApp extends StatelessWidget {
  const WeddingInvitationApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Thiệp Đám Cưới',
      theme: ThemeData(primarySwatch: Colors.pink),
      home: const HomePage(),
    );
  }
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: const [
            CoverSection(),
            AboutSection(),
            EventSection(),
            GallerySection(),
            GuestbookSection(),
            RsvpSection(),
          ],
        ),
      ),
    );
  }
}

class CoverSection extends StatelessWidget {
  const CoverSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 300,
      width: double.infinity,
      color: Colors.pinkAccent,
      child: const Center(
        child: Text(
          'Chào mừng đến với đám cưới của chúng tôi!',
          style: TextStyle(
            fontSize: 28,
            color: Colors.white,
            fontWeight: FontWeight.bold,
          ),
        ),
      ),
    );
  }
}

class AboutSection extends StatelessWidget {
  const AboutSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            'Cô dâu & Chú rể',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Text('Một câu chuyện tình yêu đẹp đẽ bắt đầu từ...'),
        ],
      ),
    );
  }
}

class EventSection extends StatelessWidget {
  const EventSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Thông Tin Tiệc Cưới',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          const Text('Ngày: 30/04/2025'),
          const Text('Địa điểm: Nhà hàng Hoàng Gia'),
          TextButton(
            onPressed: () async {
              final Uri url = Uri.parse('https://goo.gl/maps/example');
              if (await canLaunchUrl(url)) {
                await launchUrl(url);
              }
            },
            child: const Text('Xem bản đồ'),
          ),
        ],
      ),
    );
  }
}

class GallerySection extends StatelessWidget {
  const GallerySection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: GridView.count(
        crossAxisCount: 3,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        children: List.generate(
          6,
          (index) => Container(
            margin: const EdgeInsets.all(4),
            color: Colors.pink[100],
            child: const Icon(Icons.photo, size: 50),
          ),
        ),
      ),
    );
  }
}

class GuestbookSection extends StatelessWidget {
  const GuestbookSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            'Lời Chúc Từ Khách Mời',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          TextField(
            decoration: InputDecoration(hintText: 'Viết lời chúc của bạn...'),
          ),
        ],
      ),
    );
  }
}

class RsvpSection extends StatelessWidget {
  const RsvpSection({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text(
            'Xác Nhận Tham Dự',
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
          TextField(decoration: InputDecoration(hintText: 'Tên của bạn')),
          TextField(decoration: InputDecoration(hintText: 'Số người tham dự')),
        ],
      ),
    );
  }
}
