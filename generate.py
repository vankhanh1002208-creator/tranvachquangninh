import codecs
import re

with codecs.open("d:\\webthicong\\tin-tuc.html", "r", "utf-8") as f:
    content = f.read()

pattern = re.compile(r'(<div class="blog-main">).*?(</div>\s*<!-- SIDEBAR -->)', re.DOTALL)

def generate(filename, title, date, cat, img, body, base_content):
    article_html = f"""
    <div class="article-detail animate" style="background:#fff;padding:40px;border-radius:24px;border:1px solid #E2E8F0;">
        <div class="breadcrumb" style="margin-bottom:20px;display:flex;align-items:center;gap:10px;font-size:14px;color:#64748B;">
            <a href="index.html" style="color:#0B3D8E;font-weight:600;"><i class="fa-solid fa-house"></i></a>
            <i class="fa-solid fa-chevron-right" style="font-size:10px;"></i>
            <a href="tin-tuc.html" style="color:#0B3D8E;font-weight:600;">Tin Tức</a>
            <i class="fa-solid fa-chevron-right" style="font-size:10px;"></i>
            <span style="color:#64748B;">Chi tiết</span>
        </div>
        
        <div class="article-meta" style="display:flex;gap:16px;margin-bottom:20px;font-size:14px;align-items:center;">
            {cat}
            <span class="article-date" style="color:#64748B;"><i class="fa-solid fa-calendar"></i> {date}</span>
        </div>
        
        <h1 style="font-size:32px;color:#0F172A;line-height:1.4;margin-bottom:24px;font-family:'Playfair Display', serif;">{title}</h1>
        
        <img src="{img}" alt="{title}" style="width:100%;height:auto;border-radius:16px;margin-bottom:32px;aspect-ratio:16/9;object-fit:cover;">
        
        <div class="article-content" style="font-size:16px;color:#334155;line-height:1.8;">
            {body}
        </div>
    </div>
    """
    new_content = pattern.sub(f'\\1\\n{article_html}\\n\\2', base_content)
    hero_pattern = re.compile(r'(<section class="page-hero">.*?)<h1>Tin Tức & Kiến Thức</h1>(.*?</section>)', re.DOTALL)
    new_content = hero_pattern.sub(r'\1<h1 style="font-size:36px;">Blog & Kiến Thức</h1>\2', new_content)

    new_content = new_content.replace('href="#"', 'href="javascript:void(0)"')
    new_content = new_content.replace('href="javascript:void(0)">5 Loại Trần Thạch Cao', 'href="5-loai-tran-thach-cao.html">5 Loại Trần Thạch Cao')
    new_content = new_content.replace('href="javascript:void(0)">Cách Chọn Tấm Thạch Cao', 'href="cach-chon-tam-thach-cao.html">Cách Chọn Tấm Thạch Cao')
    new_content = new_content.replace('href="javascript:void(0)">Bảng Giá', 'href="bang-gia-thi-cong-tran-thach-cao-2025.html">Bảng Giá')
    new_content = new_content.replace('href="javascript:void(0)">Vách Compact', 'href="vach-compact-hpl-la-gi.html">Vách Compact')

    with codecs.open('d:\\webthicong\\' + filename, 'w', 'utf-8') as f:
        f.write(new_content)

cat_hot = '<span class="article-cat" style="background:rgba(239, 68, 68, 0.1);color:#ef4444;padding:6px 14px;border-radius:100px;font-weight:600;"><i class="fa-solid fa-fire"></i> Nổi bật</span>'
cat_know = '<span class="article-cat" style="background:rgba(11, 61, 142, 0.1);color:#0B3D8E;padding:6px 14px;border-radius:100px;font-weight:600;"><i class="fa-solid fa-layer-group"></i> Kiến Thức</span>'
cat_guide = '<span class="article-cat" style="background:rgba(249, 115, 22, 0.1);color:#F97316;padding:6px 14px;border-radius:100px;font-weight:600;"><i class="fa-solid fa-lightbulb"></i> Hướng Dẫn</span>'
cat_price = '<span class="article-cat" style="background:rgba(22, 163, 74, 0.1);color:#16a34a;padding:6px 14px;border-radius:100px;font-weight:600;"><i class="fa-solid fa-tags"></i> Báo Giá</span>'

a1 = """<p style="font-weight:600;font-size:18px;margin-bottom:24px;">Trần thạch cao bị nứt không chỉ gây mất thẩm mỹ mà còn tiềm ẩn nguy cơ. Bài viết dưới đây từ Trần Vách Quảng Ninh sẽ giúp bạn hiểu rõ nguyên nhân và cách xử lý triệt để tình trạng này.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">1. Tại sao trần thạch cao lại bị nứt?</h3>
<ul style="list-style:disc;padding-left:24px;margin-bottom:24px;">
    <li style="margin-bottom:12px;"><strong>Thi công sai kỹ thuật:</strong> Khoảng cách xương không đạt chuẩn, đan xương không chắc.</li>
    <li style="margin-bottom:12px;"><strong>Xử lý mối nối không tốt:</strong> Sử dụng băng keo hoặc bột xử lý kém chất lượng, môi trường nồm ẩm.</li>
    <li style="margin-bottom:12px;"><strong>Thay đổi thời tiết, nhiệt độ:</strong> Chiều lòng sự thay đổi vật lý của thạch cao do mốc nhiệt độ chênh lệch.</li>
</ul>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">2. Cách khắc phục rạn nứt</h3>
<p style="margin-bottom:12px;"><strong>Với vết nứt mảnh, chân chim:</strong> Vệ sinh sạch, dùng bột bả bả lại bề mặt và lăn sơn đồng màu.</p>
<p style="margin-bottom:12px;"><strong>Với vết nứt tại mối nối:</strong> Cắt mở rộng hình V, dán băng keo lưới chuyên dụng, trét bột xử lý mối nối mác cao, sau đó bả phẳng và sơn.</p>
<div style="background:#F8FAFC;padding:24px;border-left:4px solid #F97316;margin-top:32px;"><strong>Trần Vách Quảng Ninh</strong> chuyên xử lý, thi công trần vách uy tín 10 năm kinh nghiệm. Zalo: 0837.811.188.</div>"""

a2 = """<p style="font-weight:600;font-size:18px;margin-bottom:24px;">Từ trần phẳng đơn giản đến giật cấp tinh xảo, mỗi hệ trần tôn lên một định vị khác biệt cho không gian. Dưới đây là 5 mẫu thịnh hành nhất năm 2025.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">1. Trần Phẳng (Chìm)</h3>
<p>Dạng trần như bê tông đổ khuôn, phong cách hiện đại tối giản. Giá thành thi công cực rẻ và tối đa diện tích phòng.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">2. Trần Giật Cấp</h3>
<p>Hình dạng cắt lượn sóng chữ nhật hoặc tròn theo ý muốn. Phù hợp cho phòng khách gia đình vì đánh lừa thị giác làm không gian rộng rãi quyền quý lạ thường.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">3. Trần Thạch Cao Thả</h3>
<p>Hệ trần có khung xương chữ T để lộ và các module 600x600 siêu thích hợp cho dân công nghiệp nhà máy và văn phòng vì thao tác bảo trì dây điện dễ dàng.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">4. Trần Phát Lộc - CNC Phù Điêu</h3>
<p>Phiên bản nâng cấp tân cổ điển sử dụng phào hoa mỹ siêu tinh tế. Bất kỳ ai nhìn vào mâm trần dát vàng sẽ cảm giác được độ xa hoa vô cực.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">5. Trần Phủ PVC Giả Gỗ Tiêu Âm</h3>
<p>Thay đổi thị hiếu sang hệ trần gỗ nhờ tấm phim Film PVC nhưng giá thành lại rẻ bằng 1/3 giá thành trần gỗ xoan.</p>"""

a3 = """<p style="font-weight:600;font-size:18px;margin-bottom:24px;">Chọn sai tấm thạch cao chính là tự đốt tiền nhà mình sau vài năm sử dụng. Tấm tiêu chuẩn không hề chịu được nước.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">Tấm Lõi Trắng - Thạch Cao Tiêu Chuẩn</h3>
<p>Vị trí sử dụng tốt nhất: Các không gian phòng ốc hoàn toàn khô ráo thoáng mát. Giá rẻ nhất thị trường.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">Tấm Lõi Xanh - Giải Pháp Chống Ẩm Tuyệt Vời</h3>
<p>Được gia cường phụ gia xilikon hút ẩm vi diệu. Sự lựa chọn hoàn hảo bắt buộc đổi với Vệ Sinh (Toilet) , Ban Công.</p>
<h3 style="font-size:24px;color:#0F172A;margin-top:32px;margin-bottom:16px;">Tấm Lõi Đỏ - Siêu Thạch Cao Chống Cháy 120 Phút</h3>
<p>Yêu cầu dành cho hành lang các tòa nhà lớn và xưởng sản xuất KCN để bảo vệ khoang lối đi cách lý nhiệt trong thời gian đợi cứu hỏa.</p>"""

a4 = """<p style="font-weight:600;font-size:18px;margin-bottom:24px;">Trần Vách Quảng Ninh cung cấp minh bạch biểu phí thi công mới nhất. Bảng giá giúp bạn cân nhắc rõ nét dự toán cho một tổ ấm khang trang của mình.</p>
<table style="width:100%; border-collapse:collapse; margin-top:20px; font-size:15px; border:1px solid #E2E8F0;">
    <tr style="background:#F1F5F9;"><th style="padding:12px;border:1px solid #E2E8F0;text-align:left;">Hạng Mục</th><th style="padding:12px;border:1px solid #E2E8F0;">Đơn giá sơ bộ</th></tr>
    <tr><td style="padding:12px;border:1px solid #E2E8F0;">Trần phẳng (Khung Hà Nội + Tấm lõi trắng)</td><td style="padding:12px;border:1px solid #E2E8F0;">130.000đ - 140.000đ/m2</td></tr>
    <tr><td style="padding:12px;border:1px solid #E2E8F0;">Trần chống ẩm xanh (Khung Vĩnh Tường M29)</td><td style="padding:12px;border:1px solid #E2E8F0;">165.000đ - 175.000đ/m2</td></tr>
    <tr><td style="padding:12px;border:1px solid #E2E8F0;">Trần thả, nhựa 600x600 xương Vĩnh Tường</td><td style="padding:12px;border:1px solid #E2E8F0;">140.000đ - 150.000đ/m2</td></tr>
    <tr><td style="padding:12px;border:1px solid #E2E8F0;">Công thi công 2 nước bột Bả + xả bụi + sơn màu</td><td style="padding:12px;border:1px solid #E2E8F0;">65.000đ - 85.000đ/m2</td></tr>
</table>
<p style="margin-top:16px">Khối lượng m2 thực tế càng cao, đơn giá sẽ càng giảm. Liên hệ ngay để đo thực tế để có mức chiết khấu.</p>"""

a5 = """<p style="font-weight:600;font-size:18px;margin-bottom:24px;">HPL là High Pressure Laminate. Tấm compact này đang làm một cuộc cách mạng trong khu vệ sinh thương mại vì khả năng kháng nước hoàn hảo</p>
<ul style="list-style:disc;padding-left:24px;margin-bottom:24px;line-height:1.7;">
<li style="margin-bottom:12px;"><strong>Chìm Trong Nước Không Sao:</strong> Sự ép cực nén của giấy Kraft trong nhựa Melamine dìm trong nước hàng năm không nở không rực ro.</li>
<li style="margin-bottom:12px;"><strong>Tối Ưu Ngay Diện Tích:</strong> Vách gạch chiếm 10-15cm. Vách Compact chỉ 1.2 cm mà ngăn âm và riêng tư hoàn hảo, tăng cường sức chứa người lớn.</li>
<li style="margin-bottom:12px;"><strong>Trọng Lượng Cực Thấp:</strong> Vùng sàn không phải chịu gánh nặng tĩnh tải lớn từ các bộ tường gạch.</li>
</ul>
<p>Lý do nên sử dụng: Không có vách xây gạch truyền thống nào duy trì màu sắc và không bị cáu ố rác thải trên gạch rãnh. Compact thay đổi cục diện hiện tại.</p>"""

a6 = """<p style="font-weight:600;font-size:18px;margin-bottom:24px;">Không chuẩn bị móng kỹ cho nhà, trần nhà cũng thế, sơ hở là nứt, võng.</p>
<ol style="padding-left:24px;margin-bottom:24px;line-height:1.7;">
    <li style="margin-bottom:12px;"><strong>Xương rẻ, mật độ đan quá rộng:</strong> Thợ đan trên 60cm làm bụng trần thạch cao võng.</li>
    <li style="margin-bottom:12px;"><strong>Không nhả dải giãn nở:</strong> Ghim chặt trần 100% vào khung tường làm đùn và ép cấn nứt vỡ ngay ngày nắng.</li>
    <li style="margin-bottom:12px;"><strong>Sôi bột, dùng bột bả rải rẻ tiền dán mối:</strong> Băng lưới và gyp-filler mới chống nứt, còn bột bả thường tự bong.</li>
    <li style="margin-bottom:12px;"><strong>Đu bám dầm ty treo vào viên gạch sống:</strong> Cố định cốt thép ren vào tường yếu là nguyên nhân tai nạn.</li>
    <li style="margin-bottom:12px;"><strong>Xả nhám lệch, điện khoét vào xương chịu tải:</strong> Phá hủy độ chịu lực vật lý của khung chính.</li>
</ol>"""

generate('tran-thach-cao-bi-nut.html', 'Trần Thạch Cao Bị Nứt – Nguyên Nhân & Cách Khắc Phục Triệt Để', '08/03/2025', cat_hot, 'https://images.unsplash.com/photo-1628744448840-55fe2e921d7b?q=80&w=1200', a1, content)
generate('5-loai-tran-thach-cao.html', '5 Loại Trần Thạch Cao Phổ Biến Nhất 2025', '05/03/2025', cat_know, 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200', a2, content)
generate('cach-chon-tam-thach-cao.html', 'Cách Chọn Tấm Thạch Cao Phù Hợp Cho Từng Không Gian', '28/02/2025', cat_guide, 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=1200', a3, content)
generate('bang-gia-thi-cong-tran-thach-cao-2025.html', 'Bảng Giá Thi Công Trần Thạch Cao Mới Nhất 2025 Tại Quảng Ninh', '20/02/2025', cat_price, 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200', a4, content)
generate('vach-compact-hpl-la-gi.html', 'Vách Compact HPL Là Gì? Tại Sao Nên Dùng Cho Nhà Vệ Sinh?', '15/02/2025', cat_know, 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?q=80&w=1200', a5, content)
generate('10-sai-lam-khi-thi-cong.html', '10 Sai Lầm Khi Thi Công Trần Thạch Cao Làm Giảm Tuổi Thọ Công Trình', '10/02/2025', cat_guide, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200', a6, content)
