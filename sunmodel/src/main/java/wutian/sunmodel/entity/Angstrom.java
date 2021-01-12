package wutian.sunmodel.entity;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;

@Data
public class Angstrom {
    private double H_0;     // 理论辐射最大值
    private double S_0;     // 理论日照最大值
    private double day;        // 年份的第几天
    private double declinationAngle;        // 太阳偏角，年份第几天有关
    private double latitude;        // 维度
    private double sunsetAngle;     // 太阳高度角
    public double I_sc = 1361;     // 太阳常数

    public Angstrom(double day, double latitude) {
        this.day = day;
        this.latitude = latitude/180*Math.PI;
        calculateDeclinationAngle();
        calculateSunsetAngle();
        calculateS_0();
        calculateH_0();
    }

    private void calculateDeclinationAngle(){
        this.declinationAngle = 23.45*Math.sin(360*(284+this.day)/365)/180*Math.PI;
    }

    private void calculateSunsetAngle(){
        this.sunsetAngle = Math.acos(-Math.tan(this.latitude)*Math.tan(this.declinationAngle))/180*Math.PI;
    }

    private void calculateS_0(){
        this.S_0 = 2.0/15*this.sunsetAngle*180/Math.PI;
    }

    private void calculateH_0(){
        this.H_0 = 24/Math.PI*this.I_sc*(1+0.33*Math.cos(360*this.day/365))*(Math.cos(this.latitude)*Math.cos(this.declinationAngle)*Math.sin(this.sunsetAngle))+
                2*Math.PI*this.sunsetAngle/360*Math.sin(this.latitude)*Math.sin(this.declinationAngle);
    }

    @Override
    public String toString(){
        return "H_O: " + this.H_0 + "\n" +
                "S_O: " + this.S_0 + "\n" +
                "declinationAngle: "+ this.declinationAngle + "\n" +
                "sunsetAngle: "+ this.sunsetAngle + "\n";
    }
}
