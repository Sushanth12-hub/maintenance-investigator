import asyncio
import io
import time
import pandas as pd
import numpy as np
from datetime import datetime, timezone

class SCADAHistorianConnector:
    """
    Asynchronous connector simulating OPC-UA (IEC 62541) node subscription
    and MQTT sparkplug-B edge telemetry stream buffering.
    """
    def __init__(self, endpoint_url: str = "opc.tcp://127.0.0.1:4840/freeopcua/server/"):
        self.endpoint_url = endpoint_url
        self.connected = False
        self.buffer = []
        self.buffer_limit = 24  # 24-point trailing rolling window

    async def connect(self):
        # Emulate OPC-UA TCP handshake & security token negotiation
        await asyncio.sleep(0.05)
        self.connected = True
        return {"status": "CONNECTED", "protocol": "OPC-UA / IEC 62541", "endpoint": self.endpoint_url}

    def ingest_live_sample(self, tag: str, vibration_velocity: float, temperature_c: float):
        """Append real-time telemetry from edge broker to ring buffer."""
        timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        record = {
            "timestamp": timestamp,
            "vibration_velocity": round(float(vibration_velocity), 2),
            "bearing_temperature": round(float(temperature_c), 2)
        }
        self.buffer.append(record)
        if len(self.buffer) > self.buffer_limit:
            self.buffer.pop(0)
        return record

    def export_buffer_as_csv_bytes(self) -> bytes:
        """Convert current rolling memory buffer into valid CSV bytes for analysis engine."""
        if not self.buffer:
            # Generate deterministic fallback window
            times = [f"2026-09-06 {i:02d}:00:00" for i in range(12)]
            vibs = [1.4, 1.5, 1.3, 1.6, 1.8, 2.1, 2.9, 4.2, 5.8, 7.2, 8.4, 9.1]
            temps = [42.0 + (i * 0.6) for i in range(12)]
            df = pd.DataFrame({"timestamp": times, "vibration_velocity": vibs, "bearing_temperature": temps})
        else:
            df = pd.DataFrame(self.buffer)

        buf = io.BytesIO()
        df.to_csv(buf, index=False)
        return buf.getvalue()

historian_client = SCADAHistorianConnector()
