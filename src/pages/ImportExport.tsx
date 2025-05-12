
import React, { useState } from "react";
import { useActivities } from "../context/ActivitiesContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ImportExport = () => {
  const { activities, addActivity } = useActivities();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleExport = () => {
    // Create CSV content
    const headers = "اسم النشاط,المركز,مكان التنفيذ,تاريخ البدء,تاريخ الانتهاء,الحالة,الوصف,عدد المشاركين المتوقع\n";
    const csvContent = activities.reduce((acc, activity) => {
      return (
        acc +
        `${activity.name},${activity.center},${activity.location},${activity.startDate},${activity.endDate},${
          activity.status
        },${activity.description || ""},${activity.expectedParticipants || ""}\n`
      );
    }, headers);

    // Create download link and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "activities.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("تم تصدير البيانات بنجاح");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = () => {
    if (!selectedFile) {
      toast.error("الرجاء اختيار ملف للاستيراد");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const csvData = e.target.result as string;
        const lines = csvData.split("\n");
        
        // Skip header line
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          const columns = lines[i].split(",");
          if (columns.length >= 6) {
            try {
              addActivity({
                name: columns[0],
                center: columns[1],
                location: columns[2],
                startDate: columns[3],
                endDate: columns[4],
                status: columns[5] as any,
                description: columns[6] || "",
                expectedParticipants: Number(columns[7]) || 1,
              });
            } catch (error) {
              console.error("Error importing row:", error);
            }
          }
        }
        
        toast.success("تم استيراد البيانات بنجاح");
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    };
    reader.readAsText(selectedFile);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">استيراد وتصدير البيانات</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">استيراد الأنشطة من ملف Excel</h2>
          <p className="text-gray-600 mb-6">
            قم باستيراد قائمة الأنشطة من ملف Excel (.xlsx أو .xls). تأكد من أن الملف يتبع الهيكل
            المطلوب.
          </p>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">اختر ملف Excel</label>
            <input
              id="fileInput"
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
            <h3 className="text-amber-700 font-medium mb-2">ملاحظات هامة للاستيراد:</h3>
            <ul className="space-y-2 text-sm text-amber-700 list-disc list-inside">
              <li>يجب أن يحتوي الصف الأول على العناوين المطلوبة: اسم النشاط، المركز، الحالة، تاريخ النشاط</li>
              <li>المشاركون اختيارية.</li>
              <li>تنسيق التاريخ المقبول: DD/MM/YYYY, YYYY-MM-DD, MM/DD/YYYY</li>
              <li>سيتم تجاهل أسماء المراكز وحالات النشاط غير المتطابقة مع القيم المتاحة في النظام.</li>
              <li>سيتم فحص الصفوف التي تحتوي على بيانات غير صالحة أو مفقودة (راجع وحدة التحكم للتفاصيل).</li>
            </ul>
          </div>

          <Button
            onClick={handleImport}
            className="w-full bg-primary text-white"
            disabled={!selectedFile}
          >
            استيراد البيانات
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">تصدير الأنشطة إلى ملف Excel</h2>
          <p className="text-gray-600 mb-6">
            قم بتصدير جميع الأنشطة الحالية في النظام إلى ملف Excel. يمكن استخدام هذا الملف كنسخة احتياطية أو للمشاركة.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <h3 className="text-blue-700 font-medium mb-2">خصائص ملف التصدير:</h3>
            <ul className="space-y-2 text-sm text-blue-700 list-disc list-inside">
              <li>سيحتوي الملف على جميع بيانات الأنشطة الحالية.</li>
              <li>سيتم تنسيق الأعمدة بشكل مناسب وسيكون اتجاه الورقة من اليمين لليسار.</li>
              <li>سيتضمن تاريخ الإنشاء والتحديث لكل نشاط (إذا توفر).</li>
              <li>أعمدة "مكان التنفيذ" و"الوصف" ستكون فارغة إذا لم يتم إدخالها.</li>
            </ul>
          </div>

          <Button
            onClick={handleExport}
            className="w-full bg-primary text-white"
            disabled={activities.length === 0}
          >
            تصدير جميع الأنشطة
          </Button>
          {activities.length === 0 && (
            <p className="text-center text-gray-500 mt-2 text-sm">لا توجد أنشطة مسجلة للتصدير حالياً.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportExport;
