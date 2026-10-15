import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

/// Top-level background FCM message handler
Future<void> _firebaseMessagingBackgroundHandler(dynamic message) async {
  // Handles incoming background FCM push notifications for new messages and likes
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const MzansiDatingApp());
}

/// ---------------------------------------------------------------------------
/// DESIGN SYSTEM CONSTANTS & TOKENS
/// ---------------------------------------------------------------------------
class MzansiTheme {
  static const Color goldLight = Color(0xFFDFBF75);
  static const Color goldPrimary = Color(0xFFC5A253);
  static const Color goldDark = Color(0xFFB78E3E);

  static const Color bgLavender = Color(0xFFE9D5FF);
  static const Color bgRose = Color(0xFFFBCFE8);
  static const Color bgLilac = Color(0xFFE8C4FF);

  static const Color cardWhite = Color(0xFFFFFFFF);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF6B7280);
  static const Color activePurple = Color(0xFF9333EA);

  static const LinearGradient backgroundGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [bgLavender, bgRose, bgLilac],
  );

  static const LinearGradient goldGradient = LinearGradient(
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
    colors: [goldPrimary, goldDark],
  );

  static List<BoxShadow> cardShadow = [
    BoxShadow(
      color: const Color(0xFF4A0E4E).withOpacity(0.08),
      blurRadius: 18,
      offset: const Offset(0, 6),
    ),
  ];
}

/// ---------------------------------------------------------------------------
/// ROOT WIDGET
/// ---------------------------------------------------------------------------
class MzansiDatingApp extends StatelessWidget {
  const MzansiDatingApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mzansi Dating',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: Colors.transparent,
        textTheme: GoogleFonts.plusJakartaSansTextTheme(
          Theme.of(context).textTheme,
        ),
      ),
      home: const MainNavigationController(),
    );
  }
}

/// ---------------------------------------------------------------------------
/// MAIN NAVIGATION CONTROLLER (State & Screen Routing)
/// ---------------------------------------------------------------------------
class MainNavigationController extends StatefulWidget {
  const MainNavigationController({super.key});

  @override
  State<MainNavigationController> createState() =>
      _MainNavigationControllerState();
}

class _MainNavigationControllerState extends State<MainNavigationController> {
  bool _isAuthenticated = false;
  int _activeAuthScreen = 0; // 0 = Login, 1 = SignUp
  int _activeTabIndex = 0; // 0 = Discover, 1 = Likes, 2 = Chat, 3 = VIP, 4 = Profile
  bool _showVerificationDirect = false;
  bool _isVipSubscriber = false;
  int _userCoins = 350;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        gradient: MzansiTheme.backgroundGradient,
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: SafeArea(
          bottom: false,
          child: Stack(
            children: [
              // Screen Body
              if (!_isAuthenticated)
                _activeAuthScreen == 0
                    ? LoginScreen(
                        onLoginSuccess: () {
                          setState(() => _isAuthenticated = true);
                        },
                        onNavigateToSignUp: () {
                          setState(() => _activeAuthScreen = 1);
                        },
                      )
                    : SignUpScreen(
                        onSignUpSuccess: () {
                          setState(() => _isAuthenticated = true);
                        },
                        onNavigateToLogin: () {
                          setState(() => _activeAuthScreen = 0);
                        },
                      )
              else if (_showVerificationDirect)
                VerificationScreen(
                  onCompleted: () {
                    setState(() => _showVerificationDirect = false);
                  },
                )
              else ...[
                IndexedStack(
                  index: _activeTabIndex,
                  children: [
                    DiscoverScreen(
                      onOpenChat: () => setState(() => _activeTabIndex = 2),
                    ),
                    const LikesScreen(),
                    ChatScreen(
                      isVip: _isVipSubscriber,
                      userCoins: _userCoins,
                      onUnlockVip: () {
                        setState(() => _isVipSubscriber = true);
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('VIP Pass Activated! R149/mo')),
                        );
                      },
                    ),
                    VIPScreen(
                      isVip: _isVipSubscriber,
                      userCoins: _userCoins,
                      onSubscribe: () {
                        setState(() => _isVipSubscriber = true);
                      },
                    ),
                    ProfileScreen(
                      userCoins: _userCoins,
                      isVip: _isVipSubscriber,
                      onNavigateVerification: () {
                        setState(() => _showVerificationDirect = true);
                      },
                      onLogout: () {
                        setState(() => _isAuthenticated = false);
                      },
                    ),
                  ],
                ),

                // Floating 32px White Pill Bottom Navigation
                Align(
                  alignment: Alignment.bottomCenter,
                  child: Padding(
                    padding: const EdgeInsets.only(bottom: 24, left: 16, right: 16),
                    child: _buildBottomNavPill(),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildBottomNavPill() {
    return Container(
      height: 64,
      decoration: BoxDecoration(
        color: MzansiTheme.cardWhite.withOpacity(0.95),
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF4A0E4E).withOpacity(0.12),
            blurRadius: 20,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          _navItem(0, Icons.explore_outlined, 'Discover'),
          _navItem(1, Icons.favorite_border, 'Likes', badge: '3'),
          _navItem(2, Icons.chat_bubble_outline, 'Chat', badge: '1'),
          _navItem(3, Icons.workspace_premium, 'VIP', isVipBadge: true),
          _navItem(4, Icons.person_outline, 'Profile'),
        ],
      ),
    );
  }

  Widget _navItem(int index, IconData icon, String label,
      {String? badge, bool isVipBadge = false}) {
    final bool isActive = _activeTabIndex == index;
    return GestureDetector(
      onTap: () => setState(() => _activeTabIndex = index),
      behavior: HitTestBehavior.opaque,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            clipBehavior: Clip.none,
            children: [
              Icon(
                icon,
                size: 24,
                color: isVipBadge
                    ? (isActive ? MzansiTheme.goldDark : MzansiTheme.goldPrimary)
                    : (isActive ? MzansiTheme.activePurple : MzansiTheme.textMuted),
              ),
              if (badge != null)
                Positioned(
                  top: -4,
                  right: -8,
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: const BoxDecoration(
                      color: Colors.redAccent,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      badge,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 8,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                ),
              if (isVipBadge)
                Positioned(
                  top: -4,
                  right: -10,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                    decoration: BoxDecoration(
                      gradient: MzansiTheme.goldGradient,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      '18+',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 7,
                        fontWeight: FontWeight.w900,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 3),
          Text(
            label,
            style: TextStyle(
              fontSize: 10,
              fontWeight: isActive ? FontWeight.bold : FontWeight.w500,
              color: isVipBadge
                  ? MzansiTheme.goldDark
                  : (isActive ? MzansiTheme.activePurple : MzansiTheme.textMuted),
            ),
          ),
        ],
      ),
    );
  }
}

/// ---------------------------------------------------------------------------
/// SCREEN 1: LOGIN SCREEN (Exact replica of Reference Design)
/// ---------------------------------------------------------------------------
class LoginScreen extends StatefulWidget {
  final VoidCallback onLoginSuccess;
  final VoidCallback onNavigateToSignUp;

  const LoginScreen({
    super.key,
    required this.onLoginSuccess,
    required this.onNavigateToSignUp,
  });

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _rememberMe = true;
  bool _obscurePassword = true;

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      child: Column(
        children: [
          const SizedBox(height: 10),
          // Top Clover Logo + Brand
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(Icons.eco, color: MzansiTheme.goldPrimary, size: 22),
              const SizedBox(width: 6),
              Text(
                'Mzansi Dating',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: MzansiTheme.goldDark,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Headline: "Find Love E Mzansi" large white serif bold
          Text(
            'Find Love E Mzansi',
            textAlign: TextAlign.center,
            style: GoogleFonts.playfairDisplay(
              fontSize: 32,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              shadows: [
                Shadow(
                  color: Colors.black.withOpacity(0.15),
                  blurRadius: 8,
                  offset: const Offset(0, 2),
                ),
              ],
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Welcome back! Log in to continue your journey',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white, fontSize: 13),
          ),
          const SizedBox(height: 24),

          // White Card rounded 24px with soft shadow
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: MzansiTheme.cardWhite,
              borderRadius: BorderRadius.circular(24),
              boxShadow: MzansiTheme.cardShadow,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Email Input
                const Text(
                  'EMAIL ADDRESS',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: MzansiTheme.textDark,
                  ),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _emailController,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.mail_outline,
                        color: MzansiTheme.goldPrimary, size: 20),
                    hintText: 'you@email.com',
                    hintStyle: const TextStyle(color: MzansiTheme.textMuted),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: Colors.grey.shade200),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: Colors.grey.shade200),
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Password Input
                const Text(
                  'PASSWORD',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: MzansiTheme.textDark,
                  ),
                ),
                const SizedBox(height: 6),
                TextField(
                  controller: _passwordController,
                  obscureText: _obscurePassword,
                  decoration: InputDecoration(
                    prefixIcon: const Icon(Icons.lock_outline,
                        color: MzansiTheme.goldPrimary, size: 20),
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword ? Icons.visibility_off : Icons.visibility,
                        color: Colors.grey,
                        size: 18,
                      ),
                      onPressed: () =>
                          setState(() => _obscurePassword = !_obscurePassword),
                    ),
                    hintText: '••••••••',
                    hintStyle: const TextStyle(color: MzansiTheme.textMuted),
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    contentPadding: const EdgeInsets.symmetric(vertical: 14),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: Colors.grey.shade200),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                      borderSide: BorderSide(color: Colors.grey.shade200),
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Remember me & Forgot Password
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Checkbox(
                          value: _rememberMe,
                          activeColor: MzansiTheme.goldPrimary,
                          onChanged: (v) =>
                              setState(() => _rememberMe = v ?? true),
                        ),
                        const Text(
                          'Remember me',
                          style: TextStyle(
                              fontSize: 12, color: MzansiTheme.textMuted),
                        ),
                      ],
                    ),
                    TextButton(
                      onPressed: () {},
                      child: const Text(
                        'Forgot password?',
                        style: TextStyle(
                          fontSize: 12,
                          color: MzansiTheme.goldDark,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 14),

                // Gold Gradient Button "Log In"
                GestureDetector(
                  onTap: widget.onLoginSuccess,
                  child: Container(
                    width: double.infinity,
                    height: 50,
                    decoration: BoxDecoration(
                      gradient: MzansiTheme.goldGradient,
                      borderRadius: BorderRadius.circular(14),
                      boxShadow: [
                        BoxShadow(
                          color: MzansiTheme.goldPrimary.withOpacity(0.3),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      'Log In',
                      style: TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                  ),
                ),
                const SizedBox(height: 20),

                // Divider: "or continue with"
                Row(
                  children: [
                    Expanded(child: Divider(color: Colors.grey.shade200)),
                    Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      child: Text(
                        'OR CONTINUE WITH',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey.shade400,
                        ),
                      ),
                    ),
                    Expanded(child: Divider(color: Colors.grey.shade200)),
                  ],
                ),
                const SizedBox(height: 16),

                // Google & Apple Buttons
                Row(
                  children: [
                    Expanded(
                      child: OutlinedButton(
                        onPressed: widget.onLoginSuccess,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          side: BorderSide(color: Colors.grey.shade200),
                        ),
                        child: const Text('Google', style: TextStyle(color: Colors.black87)),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: OutlinedButton(
                        onPressed: widget.onLoginSuccess,
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          side: BorderSide(color: Colors.grey.shade200),
                        ),
                        child: const Text('Apple', style: TextStyle(color: Colors.black87)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),

                // Don't have an account? Sign Up
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Don't have an account? ",
                        style: TextStyle(fontSize: 12, color: MzansiTheme.textMuted)),
                    GestureDetector(
                      onTap: widget.onNavigateToSignUp,
                      child: const Text(
                        'Sign Up',
                        style: TextStyle(
                          fontSize: 12,
                          color: MzansiTheme.goldDark,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Footer Terms
          const Text(
            'Terms  ·  Privacy Policy',
            style: TextStyle(color: Colors.white70, fontSize: 11),
          ),
        ],
      ),
    );
  }
}

/// ---------------------------------------------------------------------------
/// SCREEN 2: SIGN UP SCREEN
/// ---------------------------------------------------------------------------
class SignUpScreen extends StatefulWidget {
  final VoidCallback onSignUpSuccess;
  final VoidCallback onNavigateToLogin;

  const SignUpScreen({
    super.key,
    required this.onSignUpSuccess,
    required this.onNavigateToLogin,
  });

  @override
  State<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends State<SignUpScreen> {
  bool _ageConfirmed = false;
  String _selectedProvince = 'Gauteng';

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: widget.onNavigateToLogin,
              ),
              const Spacer(),
              Text(
                'Join Mzansi Dating',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const Spacer(),
              const SizedBox(width: 48),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: MzansiTheme.cardWhite,
              borderRadius: BorderRadius.circular(24),
              boxShadow: MzansiTheme.cardShadow,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _inputField('FULL NAME', 'e.g. Lerato Molefe', Icons.person_outline),
                const SizedBox(height: 14),
                _inputField('EMAIL', 'you@email.com', Icons.mail_outline),
                const SizedBox(height: 14),
                _inputField('PHONE (+27 SA / Africa / Europe)', '082 123 4567', Icons.phone_outlined),
                const SizedBox(height: 14),
                const Text('LOCATION (SA PROVINCE)',
                    style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 6),
                DropdownButtonFormField<String>(
                  value: _selectedProvince,
                  items: [
                    'Gauteng',
                    'Western Cape',
                    'KwaZulu-Natal',
                    'Mpumalanga',
                    'Eastern Cape'
                  ].map((p) => DropdownMenuItem(value: p, child: Text(p))).toList(),
                  onChanged: (v) => setState(() => _selectedProvince = v!),
                  decoration: InputDecoration(
                    filled: true,
                    fillColor: const Color(0xFFF8FAFC),
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Checkbox(
                      value: _ageConfirmed,
                      activeColor: MzansiTheme.goldPrimary,
                      onChanged: (v) => setState(() => _ageConfirmed = v ?? false),
                    ),
                    const Expanded(
                      child: Text(
                        'I confirm I am 18 years of age or older and agree to respect all members.',
                        style: TextStyle(fontSize: 11, color: MzansiTheme.textDark),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                GestureDetector(
                  onTap: () {
                    if (_ageConfirmed) widget.onSignUpSuccess();
                  },
                  child: Container(
                    width: double.infinity,
                    height: 50,
                    decoration: BoxDecoration(
                      gradient: MzansiTheme.goldGradient,
                      borderRadius: BorderRadius.circular(14),
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      'Create Profile',
                      style: TextStyle(
                          color: Colors.white, fontWeight: FontWeight.bold, fontSize: 15),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _inputField(String label, String hint, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
        const SizedBox(height: 6),
        TextField(
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: MzansiTheme.goldPrimary, size: 20),
            hintText: hint,
            hintStyle: const TextStyle(color: MzansiTheme.textMuted, fontSize: 13),
            filled: true,
            fillColor: const Color(0xFFF8FAFC),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(14),
              borderSide: BorderSide(color: Colors.grey.shade200),
            ),
          ),
        ),
      ],
    );
  }
}

/// ---------------------------------------------------------------------------
/// SCREEN 3: VERIFICATION SCREEN (3D Selfie Liveness & ID Upload)
/// ---------------------------------------------------------------------------
class VerificationScreen extends StatefulWidget {
  final VoidCallback onCompleted;

  const VerificationScreen({super.key, required this.onCompleted});

  @override
  State<VerificationScreen> createState() => _VerificationScreenState();
}

class _VerificationScreenState extends State<VerificationScreen> {
  int _step = 0; // 0 = Liveness check, 1 = ID scan, 2 = Completed
  bool _blurSensitive = true;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back, color: Colors.white),
                onPressed: widget.onCompleted,
              ),
              const Spacer(),
              Text(
                'Trust & Verification',
                style: GoogleFonts.playfairDisplay(
                    fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white),
              ),
              const Spacer(),
              const SizedBox(width: 48),
            ],
          ),
          const SizedBox(height: 16),
          Expanded(
            child: Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: MzansiTheme.cardWhite,
                borderRadius: BorderRadius.circular(24),
                boxShadow: MzansiTheme.cardShadow,
              ),
              child: _step == 0
                  ? _buildLivenessCheck()
                  : _step == 1
                      ? _buildIdUpload()
                      : _buildCompleted(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLivenessCheck() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Text(
          '3D Selfie Liveness Check',
          style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        const SizedBox(height: 6),
        const Text(
          'Position face inside oval, turn head right, then smile warmly.',
          textAlign: TextAlign.center,
          style: TextStyle(color: MzansiTheme.textMuted, fontSize: 12),
        ),
        const SizedBox(height: 24),
        Container(
          width: 180,
          height: 240,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(100),
            border: Border.all(color: MzansiTheme.goldPrimary, width: 4),
            color: Colors.purple.shade50,
          ),
          child: const Center(
            child: Icon(Icons.face_retouching_natural, size: 70, color: MzansiTheme.goldDark),
          ),
        ),
        const SizedBox(height: 24),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: MzansiTheme.goldPrimary,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          onPressed: () => setState(() => _step = 1),
          child: const Text('Confirm Liveness & Next', style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }

  Widget _buildIdUpload() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('Government Photo ID Scan',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
        const SizedBox(height: 6),
        const Text('South African Smart ID Card, Passport, or Drivers License',
            style: TextStyle(fontSize: 12, color: MzansiTheme.textMuted)),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            const Text('Privacy Shield (Blur ID numbers)', style: TextStyle(fontSize: 12)),
            Switch(
              value: _blurSensitive,
              activeColor: MzansiTheme.goldPrimary,
              onChanged: (v) => setState(() => _blurSensitive = v),
            ),
          ],
        ),
        const SizedBox(height: 20),
        Container(
          height: 140,
          width: double.infinity,
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.shade300, style: BorderStyle.solid),
          ),
          child: const Center(
            child: Text('Simulated ID Card Scanned ✓',
                style: TextStyle(color: Colors.green, fontWeight: FontWeight.bold)),
          ),
        ),
        const Spacer(),
        ElevatedButton(
          style: ElevatedButton.styleFrom(
            backgroundColor: MzansiTheme.goldPrimary,
            minimumSize: const Size(double.infinity, 50),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
          onPressed: () => setState(() => _step = 2),
          child: const Text('Submit for Purple Badge', style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }

  Widget _buildCompleted() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        const Icon(Icons.verified, color: Colors.purple, size: 64),
        const SizedBox(height: 12),
        Text('Halala! Purple Verified',
            style: GoogleFonts.playfairDisplay(fontSize: 22, fontWeight: FontWeight.bold)),
        const SizedBox(height: 6),
        const Text('Your identity has been verified. Enjoy unlocked VIP chats.',
            textAlign: TextAlign.center, style: TextStyle(color: MzansiTheme.textMuted)),
        const SizedBox(height: 24),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: MzansiTheme.goldPrimary),
          onPressed: widget.onCompleted,
          child: const Text('Explore Feed', style: TextStyle(color: Colors.white)),
        ),
      ],
    );
  }
}

/// ---------------------------------------------------------------------------
/// SCREEN 4: DISCOVER SCREEN
/// ---------------------------------------------------------------------------
class DiscoverScreen extends StatefulWidget {
  final VoidCallback onOpenChat;

  const DiscoverScreen({super.key, required this.onOpenChat});

  @override
  State<DiscoverScreen> createState() => _DiscoverScreenState();
}

class _DiscoverScreenState extends State<DiscoverScreen> {
  String _activeFilter = 'All';

  final List<String> _filters = [
    'All',
    'Nearby Mbombela',
    'Verified Purple',
    'Africa',
    'Europe',
    'Online Now',
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Find Love E Mzansi',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: MzansiTheme.goldPrimary,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.search, color: Colors.white),
                onPressed: () {},
              ),
            ],
          ),
        ),

        // Filter Chip Row
        SizedBox(
          height: 38,
          child: ListView.separated(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            scrollDirection: Axis.horizontal,
            itemCount: _filters.length,
            separatorBuilder: (_, __) => const SizedBox(width: 8),
            itemBuilder: (context, index) {
              final f = _filters[index];
              final bool isActive = _activeFilter == f;
              return GestureDetector(
                onTap: () => setState(() => _activeFilter = f),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    gradient: isActive ? MzansiTheme.goldGradient : null,
                    color: isActive ? null : Colors.white.withOpacity(0.9),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 4),
                    ],
                  ),
                  child: Text(
                    f,
                    style: TextStyle(
                      color: isActive ? Colors.white : MzansiTheme.textDark,
                      fontSize: 11,
                      fontWeight: isActive ? FontWeight.bold : FontWeight.normal,
                    ),
                  ),
                ),
              );
            },
          ),
        ),
        const SizedBox(height: 12),

        // 2-Column Grid
        Expanded(
          child: RefreshIndicator(
            onRefresh: () async => await Future.delayed(const Duration(milliseconds: 600)),
            child: GridView.count(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 0.68,
              children: [
                _profileCard('Thandeka', 25, 'Mbombela 🇿🇦', true),
                _profileCard('Zola', 24, 'Durban 🇿🇦', true),
                _profileCard('Sipho', 28, 'Johannesburg 🇿🇦', true),
                _profileCard('Kamo', 26, 'Sandton 🇿🇦', false),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _profileCard(String name, int age, String location, bool isPurple) {
    return GestureDetector(
      onTap: widget.onOpenChat,
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: MzansiTheme.cardShadow,
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(20),
          child: Stack(
            fit: StackFit.expand,
            children: [
              Container(color: Colors.purple.shade100),
              // Gradient bottom
              Align(
                alignment: Alignment.bottomCenter,
                child: Container(
                  height: 120,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topCenter,
                      end: Alignment.bottomCenter,
                      colors: [Colors.transparent, Colors.black.withOpacity(0.85)],
                    ),
                  ),
                ),
              ),
              Positioned(
                bottom: 12,
                left: 10,
                right: 10,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '$name, $age',
                      style: GoogleFonts.playfairDisplay(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                    ),
                    Text(
                      location,
                      style: const TextStyle(color: Colors.white70, fontSize: 11),
                    ),
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        if (isPurple)
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                            decoration: BoxDecoration(
                              gradient: MzansiTheme.goldGradient,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Text(
                              'Purple Verified',
                              style: TextStyle(
                                  color: Colors.white, fontSize: 8, fontWeight: FontWeight.bold),
                            ),
                          ),
                        Container(
                          padding: const EdgeInsets.all(5),
                          decoration: const BoxDecoration(
                            color: Colors.white,
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.favorite,
                              color: MzansiTheme.goldPrimary, size: 14),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

/// ---------------------------------------------------------------------------
/// SCREEN 5: CHAT SCREEN (WhatsApp style with Real-Time Typing Listener)
/// ---------------------------------------------------------------------------
class ChatScreen extends StatefulWidget {
  final bool isVip;
  final int userCoins;
  final VoidCallback onUnlockVip;

  const ChatScreen({
    super.key,
    required this.isVip,
    required this.userCoins,
    required this.onUnlockVip,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _msgController = TextEditingController();
  bool _isTyping = false;

  final List<Map<String, dynamic>> _messages = [
    {
      'isMe': false,
      'text': 'Sawubona! Are you enjoying Mbombela today? 🌸',
      'time': '11:15',
    },
    {
      'isMe': true,
      'text': 'Unjani Thandeka! The Lowveld view is breathtaking.',
      'time': '11:18',
    },
    {
      'isMe': false,
      'isPhoto': true,
      'time': '11:21',
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Header on White Card (NO dark purple)
        Container(
          margin: const EdgeInsets.fromLTRB(16, 8, 16, 8),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
          decoration: BoxDecoration(
            color: MzansiTheme.cardWhite,
            borderRadius: BorderRadius.circular(24),
            boxShadow: MzansiTheme.cardShadow,
          ),
          child: Row(
            children: [
              const CircleAvatar(
                radius: 18,
                backgroundColor: Colors.purple,
                child: Text('T', style: TextStyle(color: Colors.white)),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: const [
                  Text('Thandeka, 25',
                      style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  Text('Purple Verified • Online',
                      style: TextStyle(
                          color: Colors.green, fontSize: 10, fontWeight: FontWeight.bold)),
                ],
              ),
              const Spacer(),
              IconButton(
                icon: const Icon(Icons.call, color: MzansiTheme.goldPrimary, size: 20),
                onPressed: () {},
              ),
              IconButton(
                icon: const Icon(Icons.videocam, color: MzansiTheme.goldPrimary, size: 20),
                onPressed: () {},
              ),
            ],
          ),
        ),

        // Message List
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: _messages.length,
            itemBuilder: (context, index) {
              final m = _messages[index];
              return _buildBubble(m);
            },
          ),
        ),

        // Typing indicator
        if (_isTyping)
          Padding(
            padding: const EdgeInsets.only(left: 20, bottom: 8),
            child: Row(
              children: const [
                Text('Thandeka is typing...',
                    style: TextStyle(
                        fontSize: 11,
                        color: MzansiTheme.goldDark,
                        fontWeight: FontWeight.bold)),
              ],
            ),
          ),

        // Safety Banner (small purple 10% opacity)
        Container(
          margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: Colors.purple.withOpacity(0.10),
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Text(
            'Mandatory Safety: Public venues only • 100% Consensual • Report button available',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 10, color: Colors.purple, fontWeight: FontWeight.bold),
          ),
        ),

        // Input Bar: White pill with attachment, text, gift, gold circular send button
        Container(
          margin: const EdgeInsets.fromLTRB(16, 4, 16, 96),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: MzansiTheme.cardWhite,
            borderRadius: BorderRadius.circular(32),
            boxShadow: MzansiTheme.cardShadow,
          ),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.attach_file, color: Colors.grey, size: 20),
                onPressed: () {},
              ),
              Expanded(
                child: TextField(
                  controller: _msgController,
                  onChanged: (text) {
                    setState(() => _isTyping = text.isNotEmpty);
                  },
                  decoration: const InputDecoration(
                    hintText: 'Type a message...',
                    border: InputBorder.none,
                    isDense: true,
                  ),
                ),
              ),
              IconButton(
                icon: const Icon(Icons.card_giftcard, color: MzansiTheme.goldPrimary, size: 20),
                onPressed: () {},
              ),
              GestureDetector(
                onTap: () {
                  if (_msgController.text.isNotEmpty) {
                    setState(() {
                      _messages.add({
                        'isMe': true,
                        'text': _msgController.text,
                        'time': 'Just now',
                      });
                      _msgController.clear();
                      _isTyping = false;
                    });
                  }
                },
                child: Container(
                  width: 36,
                  height: 36,
                  decoration: const BoxDecoration(
                    gradient: MzansiTheme.goldGradient,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.send, color: Colors.white, size: 16),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildBubble(Map<String, dynamic> m) {
    final bool isMe = m['isMe'] == true;

    if (m['isPhoto'] == true) {
      return Align(
        alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
        child: Container(
          width: 200,
          height: 160,
          margin: const EdgeInsets.symmetric(vertical: 4),
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(20),
          ),
          child: widget.isVip
              ? const Center(child: Text('Unblurred Photo ✓'))
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.lock, color: MzansiTheme.goldDark),
                    const SizedBox(height: 6),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: MzansiTheme.goldPrimary,
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      ),
                      onPressed: widget.onUnlockVip,
                      child: const Text('Unlock with VIP R149/mo',
                          style: TextStyle(fontSize: 10, color: Colors.white)),
                    ),
                  ],
                ),
        ),
      );
    }

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        decoration: BoxDecoration(
          gradient: isMe ? MzansiTheme.goldGradient : null,
          color: isMe ? null : Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: isMe ? null : MzansiTheme.cardShadow,
        ),
        child: Column(
          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              m['text'] ?? '',
              style: TextStyle(
                color: isMe ? Colors.white : MzansiTheme.textDark,
                fontSize: 13,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              m['time'] ?? '',
              style: TextStyle(
                color: isMe ? Colors.white70 : Colors.grey,
                fontSize: 9,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// ---------------------------------------------------------------------------
/// SCREEN 6: VIP (18+) CREATORS SCREEN (Strict Consensual Public Meetup Rules)
/// ---------------------------------------------------------------------------
class VIPScreen extends StatelessWidget {
  final bool isVip;
  final int userCoins;
  final VoidCallback onSubscribe;

  const VIPScreen({
    super.key,
    required this.isVip,
    required this.userCoins,
    required this.onSubscribe,
  });

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Mzansi VIP (18+)',
                  style: GoogleFonts.playfairDisplay(
                      fontSize: 22, fontWeight: FontWeight.bold, color: Colors.white)),
              Text('$userCoins Coins',
                  style: const TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold)),
            ],
          ),
          const SizedBox(height: 12),

          // Safety Disclaimer Banner
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.purple.shade900.withOpacity(0.85),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'Safety Disclaimer: All interactions must be consensual between adults 18+. Public venues only. No forced services or illicit solicitation.',
              style: TextStyle(color: Colors.white, fontSize: 11),
            ),
          ),
          const SizedBox(height: 16),

          // VIP Monthly Subscription Card
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              gradient: MzansiTheme.goldGradient,
              borderRadius: BorderRadius.circular(24),
              boxShadow: MzansiTheme.cardShadow,
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text('VIP Pass Unlimited',
                        style: TextStyle(
                            color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16)),
                    Text('R149 / month',
                        style: TextStyle(color: Colors.white70, fontSize: 13)),
                  ],
                ),
                ElevatedButton(
                  onPressed: onSubscribe,
                  child: Text(isVip ? 'Active ✓' : 'Subscribe'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// ---------------------------------------------------------------------------
/// LIKES & PROFILE SCREENS
/// ---------------------------------------------------------------------------
class LikesScreen extends StatelessWidget {
  const LikesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Text('3 People Liked You e Mzansi',
          style: GoogleFonts.playfairDisplay(fontSize: 18, color: Colors.white)),
    );
  }
}

class ProfileScreen extends StatelessWidget {
  final int userCoins;
  final bool isVip;
  final VoidCallback onNavigateVerification;
  final VoidCallback onLogout;

  const ProfileScreen({
    super.key,
    required this.userCoins,
    required this.isVip,
    required this.onNavigateVerification,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 100),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: MzansiTheme.cardWhite,
              borderRadius: BorderRadius.circular(24),
              boxShadow: MzansiTheme.cardShadow,
            ),
            child: Column(
              children: [
                const CircleAvatar(radius: 36, backgroundColor: MzansiTheme.goldPrimary),
                const SizedBox(height: 10),
                const Text('Thandeka Zulu, 25',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                const Text('Mbombela, South Africa 🇿🇦',
                    style: TextStyle(color: MzansiTheme.textMuted)),
                const SizedBox(height: 16),
                ElevatedButton(
                  onPressed: onNavigateVerification,
                  child: const Text('Get Purple Verified Badge'),
                ),
                const SizedBox(height: 8),
                TextButton(
                  onPressed: onLogout,
                  child: const Text('Log Out', style: TextStyle(color: Colors.redAccent)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
