# Business Requirements Document (BRD)
## Sistem Preventive Maintenance SPBU

**Versi:** 1.0  
**Tanggal:** 15 Agustus 2025  
**Dokumen ID:** BRD-PM-001  
**Status:** Draft  

---

## 1. EXECUTIVE SUMMARY

### 1.1 Tujuan Dokumen
Dokumen ini mendefinisikan kebutuhan bisnis untuk pengembangan sistem Preventive Maintenance SPBU yang komprehensif untuk mengoptimalkan operasi dan mengurangi downtime peralatan kritis.

### 1.2 Ringkasan Proyek
Sistem Preventive Maintenance SPBU adalah aplikasi web yang dirancang untuk mengelola, memantau, dan mengoptimalkan proses maintenance peralatan di Stasiun Pengisian Bahan Bakar Umum (SPBU). Sistem ini bertujuan untuk meningkatkan efisiensi operasional, mengurangi biaya maintenance, dan memastikan ketersediaan peralatan yang optimal.

### 1.3 Manfaat Bisnis
- **Pengurangan Downtime**: Mengurangi waktu henti peralatan hingga 40%
- **Optimasi Biaya**: Mengurangi biaya maintenance hingga 25%
- **Peningkatan Kepatuhan SLA**: Mencapai target SLA 95%
- **Peningkatan Produktivitas**: Meningkatkan efisiensi teknisi hingga 30%
- **Keputusan Data-Driven**: Memberikan insight berbasis data untuk pengambilan keputusan

---

## 2. BUSINESS CONTEXT

### 2.1 Latar Belakang
SPBU memerlukan sistem maintenance yang terintegrasi untuk mengelola berbagai peralatan kritis seperti:
- Dispenser bahan bakar
- Genset
- Sistem CCTV
- Panel listrik
- Sistem ATG (Automatic Tank Gauge)
- Sistem komputer dan IT

### 2.2 Stakeholders
- **Primary Users**: Admin Maintenance, Supervisor, Teknisi
- **Secondary Users**: Manager Operasional, Vendor Eksternal
- **IT Support**: Tim IT untuk maintenance sistem
- **End Customers**: Pengguna SPBU (dampak tidak langsung)

### 2.3 Business Drivers
- Kebutuhan compliance dengan standar operasional
- Tekanan untuk meningkatkan efisiensi operasional
- Kebutuhan real-time monitoring peralatan
- Tuntutan pelaporan yang akurat dan tepat waktu

---

## 3. BUSINESS REQUIREMENTS

### 3.1 Functional Requirements

#### 3.1.1 Dashboard Management
**Requirement ID:** FR-001  
**Priority:** High  
**Description:** Sistem harus menyediakan dashboard komprehensif yang menampilkan:
- KPI utama (Active Work Orders, SLA Compliance, Response Time, Equipment Health)
- AI Assistant untuk interaksi natural language
- Overview work orders dengan status real-time
- Equipment health monitoring
- Process flow visualization
- Recent notifications

**Acceptance Criteria:**
- Dashboard dapat menampilkan data real-time
- AI Assistant dapat menjawab pertanyaan tentang status maintenance
- KPI dapat di-filter berdasarkan periode waktu
- Responsive design untuk berbagai ukuran layar

#### 3.1.2 Equipment Management
**Requirement ID:** FR-002  
**Priority:** High  
**Description:** Sistem harus mampu mengelola data peralatan dengan fitur:
- Master data peralatan (Dispenser, Genset, CCTV, Panel Listrik, ATG, IT System)
- Health score monitoring dengan threshold yang dapat dikonfigurasi
- Maintenance history tracking
- Equipment specifications management
- Location-based equipment grouping
- Health trend analysis

**Acceptance Criteria:**
- Sistem dapat menampilkan health score peralatan secara real-time
- Maintenance history dapat diakses dan di-export
- Equipment dapat di-filter berdasarkan kategori, status, dan lokasi
- Health degradation dapat dihitung berdasarkan running hours

#### 3.1.3 Work Order Management
**Requirement ID:** FR-003  
**Priority:** High  
**Description:** Sistem harus menyediakan manajemen work order yang lengkap:
- Work order creation (Preventive, Emergency, Calibration, Corrective)
- Technician assignment (Internal, Vendor, Vendor + Internal)
- Priority management (Low, Medium, High, Critical)
- Status tracking (Open, Scheduled, In Progress, Pending, Completed, Cancelled)
- Checklist management
- File attachment support
- SLA monitoring
- Progress tracking

**Acceptance Criteria:**
- Work order dapat dibuat dengan berbagai tipe maintenance
- Assignment teknisi dapat dilakukan berdasarkan spesialisasi
- Progress dapat di-track secara real-time
- SLA compliance dapat dihitung dan dipantau

#### 3.1.4 Schedule Management
**Requirement ID:** FR-004  
**Priority:** High  
**Description:** Sistem harus menyediakan manajemen jadwal maintenance:
- Calendar view (Month, Week, Day)
- Schedule creation dan editing
- Conflict detection
- Resource allocation
- Schedule optimization
- Reminder notifications

**Acceptance Criteria:**
- Calendar dapat menampilkan jadwal dalam berbagai view
- Konflik jadwal dapat dideteksi otomatis
- Jadwal dapat di-export dalam berbagai format
- Notifikasi reminder dapat dikonfigurasi

#### 3.1.5 Team Management
**Requirement ID:** FR-005  
**Priority:** Medium  
**Description:** Sistem harus mengelola data tim teknisi dan vendor:
- Technician profile management
- Performance tracking
- Skill dan certification management
- Workload distribution
- Vendor management
- Performance analytics

**Acceptance Criteria:**
- Profile teknisi dapat dikelola lengkap
- Performance metrics dapat di-track
- Workload dapat didistribusikan secara optimal
- Vendor dapat dikelola terpisah dari teknisi internal

#### 3.1.6 Reports & Analytics
**Requirement ID:** FR-006  
**Priority:** High  
**Description:** Sistem harus menyediakan laporan dan analisis yang komprehensif:
- SLA Compliance Report
- Work Orders Report
- Downtime Analysis
- Equipment Health Report
- Technician Performance Report
- Custom report generation
- Data export (PDF, Excel)
- Chart visualization

**Acceptance Criteria:**
- Laporan dapat di-generate otomatis
- Data dapat di-export dalam berbagai format
- Chart dapat menampilkan trend data
- Filter dapat diterapkan berdasarkan periode dan lokasi

#### 3.1.7 Notification System
**Requirement ID:** FR-007  
**Priority:** High  
**Description:** Sistem harus menyediakan sistem notifikasi yang robust:
- Real-time notifications
- Priority-based alerting
- Multi-channel notifications (Email, WhatsApp, Push)
- Action-based notifications
- Notification history
- Escalation management

**Acceptance Criteria:**
- Notifikasi dapat dikirim secara real-time
- Prioritas dapat dikonfigurasi
- Multiple channel dapat digunakan
- History notifikasi dapat diakses

#### 3.1.8 Settings & Configuration
**Requirement ID:** FR-008  
**Priority:** Medium  
**Description:** Sistem harus menyediakan pengaturan yang fleksibel:
- User profile management
- Notification preferences
- System configuration
- Equipment maintenance intervals
- Health score thresholds
- API key management
- Security settings

**Acceptance Criteria:**
- Pengaturan dapat disimpan dan di-load
- Konfigurasi dapat diubah tanpa restart sistem
- Security settings dapat dikonfigurasi
- API keys dapat dikelola dengan aman

### 3.2 Non-Functional Requirements

#### 3.2.1 Performance Requirements
**Requirement ID:** NFR-001  
**Priority:** High  
**Description:** 
- Response time < 2 detik untuk operasi CRUD
- Dashboard loading time < 3 detik
- Support concurrent users hingga 100
- System availability 99.5%

#### 3.2.2 Security Requirements
**Requirement ID:** NFR-002  
**Priority:** High  
**Description:**
- Authentication dan authorization
- Data encryption in transit dan at rest
- Role-based access control
- Audit trail untuk semua operasi
- API security dengan key management

#### 3.2.3 Usability Requirements
**Requirement ID:** NFR-003  
**Priority:** Medium  
**Description:**
- Intuitive user interface
- Responsive design untuk mobile dan desktop
- Multi-language support (Indonesian, English)
- Accessibility compliance (WCAG 2.1)

#### 3.2.4 Compatibility Requirements
**Requirement ID:** NFR-004  
**Priority:** Medium  
**Description:**
- Browser compatibility (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Cross-platform compatibility
- API compatibility untuk integrasi

---

## 4. BUSINESS RULES

### 4.1 Equipment Health Rules
- Health score turun 0.01% per jam operasi
- Critical threshold: Health < 70%
- Warning threshold: Health 70-85%
- Auto alert ketika health score mencapai threshold

### 4.2 Maintenance Intervals
- Dispenser: Maintenance setiap 250 jam operasi
- Genset: Maintenance setiap 500 jam operasi
- CCTV: Maintenance setiap 1000 jam operasi
- ATG: Maintenance setiap 750 jam operasi
- Panel Listrik: Maintenance setiap 2000 jam operasi

### 4.3 SLA Rules
- Target SLA compliance: 95%
- Escalation time: 4 jam
- Reminder interval: 2 jam sebelum due date

### 4.4 Work Order Rules
- Work order otomatis dibuat berdasarkan maintenance interval
- Priority ditentukan berdasarkan equipment health dan criticality
- Assignment teknisi berdasarkan spesialisasi dan availability

---

## 5. DATA REQUIREMENTS

### 5.1 Master Data
- Equipment master data
- Technician profiles
- Vendor information
- Location data
- Maintenance procedures

### 5.2 Transaction Data
- Work orders
- Maintenance records
- Schedule data
- Notification logs
- Performance metrics

### 5.3 Configuration Data
- System settings
- User preferences
- Notification rules
- SLA configurations
- Health thresholds

---

## 6. INTEGRATION REQUIREMENTS

### 6.1 External Systems
- ERP system integration
- Email service integration
- WhatsApp API integration
- SMS gateway integration
- IoT sensor integration (future)

### 6.2 API Requirements
- RESTful API untuk mobile apps
- Webhook support untuk real-time updates
- Third-party integration APIs
- Data export APIs

---

## 7. CONSTRAINTS AND ASSUMPTIONS

### 7.1 Constraints
- Budget terbatas untuk hardware infrastructure
- Timeline pengembangan 6 bulan
- Keterbatasan bandwidth internet di beberapa lokasi SPBU
- Compliance dengan regulasi industri

### 7.2 Assumptions
- User memiliki basic computer literacy
- Internet connection tersedia di semua lokasi
- Data backup dan recovery procedures sudah ada
- Training user dapat dilakukan secara bertahap

---

## 8. RISK ASSESSMENT

### 8.1 Technical Risks
- **Risk**: System performance degradation
- **Mitigation**: Load testing dan performance optimization

- **Risk**: Data security breach
- **Mitigation**: Implementasi security best practices dan regular audit

### 8.2 Business Risks
- **Risk**: User adoption resistance
- **Mitigation**: Comprehensive training dan change management

- **Risk**: Integration complexity
- **Mitigation**: Phased implementation dan thorough testing

---

## 9. SUCCESS CRITERIA

### 9.1 Quantitative Metrics
- SLA compliance mencapai 95%
- Response time < 2 detik
- User satisfaction score > 4.5/5
- System availability 99.5%
- Reduction in maintenance costs 25%

### 9.2 Qualitative Metrics
- Improved operational efficiency
- Better decision making capability
- Enhanced user experience
- Reduced manual processes
- Increased data accuracy

---

## 10. IMPLEMENTATION PLAN

### 10.1 Phase 1: Core System (Months 1-2)
- Dashboard development
- Equipment management
- Basic work order management

### 10.2 Phase 2: Advanced Features (Months 3-4)
- Schedule management
- Team management
- Notification system

### 10.3 Phase 3: Analytics & Reporting (Months 5-6)
- Reports & analytics
- Advanced configurations
- Integration testing

---

## 11. APPENDICES

### 11.1 Glossary
- **SPBU**: Stasiun Pengisian Bahan Bakar Umum
- **SLA**: Service Level Agreement
- **PM**: Preventive Maintenance
- **CM**: Corrective Maintenance
- **ATG**: Automatic Tank Gauge
- **KPI**: Key Performance Indicator

### 11.2 References
- Industry best practices for maintenance management
- SPBU operational procedures
- IT security standards
- User interface design guidelines

---

**Document Control:**
- **Author**: System Analyst
- **Reviewer**: Business Analyst, Technical Lead
- **Approver**: Project Manager
- **Distribution**: Development Team, Stakeholders
- **Next Review Date**: 30 September 2025

---

*Dokumen ini merupakan living document yang akan diupdate sesuai dengan perkembangan proyek dan feedback dari stakeholders.*
