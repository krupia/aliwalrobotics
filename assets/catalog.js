/* Aliwal Robotics: catalog of common products and the components we source for them.
   Used by the intake form's "Products and components" picker.
   To add an item, add a string to a group's "items". To add a product, add a group.
   Generic component names only: no brand or model names. */
window.ALIWAL_CATALOG = [
  {
    section: "Robotics components",
    groups: [
      { product: "Humanoid robots", items: [
        "Rotary actuator modules", "Linear actuators", "Strain-wave (harmonic) reducers", "Planetary gearboxes",
        "Frameless torque motors", "Servo drives", "Absolute encoders", "6-axis force/torque sensors",
        "IMUs", "Dexterous hands", "Tactile sensor skins", "Crossed-roller bearings", "Battery packs & BMS"
      ]},
      { product: "Robot arms (collaborative & industrial)", items: [
        "Strain-wave (harmonic) reducers", "Cycloidal / RV reducers", "Servo motors", "Servo drives",
        "Joint brakes", "Absolute encoders", "Wrist force/torque sensors", "Electric grippers",
        "Vacuum grippers & cups", "Tool changers", "Teach pendants", "Robot cables & slip rings"
      ]},
      { product: "Mobile robots (AMRs / AGVs)", items: [
        "2D / 3D LiDAR", "Safety laser scanners", "Depth cameras", "Drive / hub wheel motors",
        "Motor controllers", "Wheel encoders", "Battery packs & chargers", "Bumpers & safety edges"
      ]},
      { product: "Quadruped robots", items: [
        "Leg actuator modules", "Replacement feet", "Foot contact sensors", "Battery packs",
        "Stereo / depth cameras", "LiDAR modules"
      ]},
      { product: "Teleoperation & imitation-learning rigs", items: [
        "Leader arms", "Follower arm kits", "Handheld data-collection grippers", "Wrist cameras",
        "Smart servos", "3D mice & foot pedals"
      ]},
      { product: "Compute, perception & connectivity", items: [
        "Edge AI compute modules", "Carrier boards", "RGB-D cameras", "Stereo cameras",
        "Industrial cameras & lenses", "GNSS / RTK modules", "Wi-Fi / 5G radios", "EtherCAT / CAN interfaces"
      ]}
    ]
  },
  {
    section: "Data collection devices",
    groups: [
      { product: "VR / MR headsets", items: [
        "Standalone VR / MR headsets", "PC-tethered VR headsets", "Replacement controllers", "Hand / body trackers",
        "Battery head straps", "Facial interfaces & lens spacers", "Prescription lens inserts", "Charging docks"
      ]},
      { product: "Smart glasses & egocentric cameras", items: [
        "Camera smart glasses", "Head-mounted action cameras", "360° cameras",
        "Head & chest mounts", "Spare camera batteries", "High-endurance microSD cards"
      ]},
      { product: "Motion capture & hand tracking", items: [
        "Data gloves (finger tracking)", "Inertial mocap suits", "Optical mocap cameras & markers",
        "Hand-tracking sensors", "Body trackers", "Tracking base stations"
      ]},
      { product: "Capture accessories", items: [
        "Rugged portable SSDs", "Power banks & charging hubs", "Calibration targets (ChArUco / checkerboard)",
        "Hard cases & kitting", "Head straps & comfort kits"
      ]}
    ]
  }
];
